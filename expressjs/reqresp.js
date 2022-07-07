const fetch = require('node-fetch');
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
const { Consumer } = require('sqs-consumer');
const EventEmitter = require('events');
const crypto = require('crypto');

const { processRequests, processReplies, requrl, respurl, region } = require('./config').sqs;

const sqsClient = new SQSClient({ region });
const mBus = new EventEmitter();

const responseConsumer = Consumer.create({
    queueUrl: respurl,
    handleMessage: msg => {
        const reply = JSON.parse(msg.Body);
        console.log('++ onResponseFromFriend(): reply = ', reply);

        mBus.emit(reply.correlationId, reply);
    }
});

const requestConsumer = Consumer.create({
    queueUrl: requrl,
    handleMessage: async (msg) => {
        console.log('++ onRequestForFriends(): request = ', msg);

        try {
            const request = JSON.parse(msg.Body);
            const res = await Promise.all([
                fetch('http://169.254.169.254/latest/meta-data/placement/availability-zone'),
                fetch('http://169.254.169.254/latest/meta-data/instance-id'),
                fetch('http://169.254.169.254/latest/meta-data/public-hostname')
            ]);

            const meta = await Promise.all([res[0].text(), res[1].text(), res[2].text()]);

            // const meta = [ 'local.az', 'local.id', 'local.host' ];

            const reply = {
                correlationId: request.correlationId,
                az: meta[0],
                id: meta[1],
                hostname: meta[2]
            };

            // post response back
            sqsClient.send(
                new SendMessageCommand({
                    MessageBody: JSON.stringify(reply),
                    QueueUrl: respurl
                })
            );

            console.log('++ sent reponse to friend(): reply = ', reply);
        }
        catch (e) {
            console.error(e);
            return;
        }
    }
});

function askForFriend() {
    let resolve;

    const promise = new Promise((_resolve) => {
        resolve = _resolve;
    });

    const correlationId = crypto.randomUUID();

    mBus.once(correlationId, data => {
        resolve(data);
    });

    sqsClient.send(
        new SendMessageCommand({
            MessageBody: `{ "correlationId": "${correlationId}" }`,
            QueueUrl: requrl
        })
    );

    console.log("askForFriend(): sent friend request");

    return promise;
}
if (processReplies) {
    responseConsumer.start();
    console.log("Started response queue consumer");
}

if (processRequests) {
    requestConsumer.start();
    console.log("Started request queue consumer");
}

module.exports = { askForFriend };