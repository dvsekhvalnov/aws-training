const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
const { url } = require('./config').sqs;

const sqsClient = new SQSClient({ region: 'eu-central-1' });

const EventsTotal = 10;

function random(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    );
}

(async () => {
    const waitFor = [];
    process.stdout.write('Generating');
    for (let i = 0; i < EventsTotal; i++) {
        waitFor.push(
            sqsClient.send(
                new SendMessageCommand({
                    // MessageDeduplicationId: `_id-${i}`,
                    // MessageGroupId: 'key-1',
                    MessageBody: `{ "sleep": ${random(1, 10)} }`,
                    QueueUrl: url
            }))
        );
        process.stdout.write('.');
    }

    Promise.all(waitFor);
    console.log('\nDone generating %s events.', EventsTotal);
})();

