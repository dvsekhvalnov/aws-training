const { Consumer } = require('sqs-consumer');
const { url } = require('./config').sqs;

async function handleMessage (msg) {
    // console.log('++ onMessage():');
    console.group();
    // console.log(msg);


    try {
        const payload = JSON.parse(msg.Body);
        // console.log("Payload = ", payload);

        let body = payload;

        // SNS messages
        if (payload.Message) {
            body = JSON.parse(payload.Message);
        }

        // console.log("Body = ", body);


        const sleep = body.sleep || 0;
        console.log('Sleeping for %s seconds', sleep);
        return Promise.resolve();
        // return new Promise(resolve => {
        //     setTimeout(() => {
        //         resolve();
        //     }, sleep * 1000);
        // });
    }
    catch (e) {
        console.error(e);
        return Promise.resolve();
    }
    finally {
        console.groupEnd();
    }
};

const app = Consumer.create({
    queueUrl: url,
    handleMessage
});

app.on('error', (err) => {
    console.error(err.message);
});

app.on('processing_error', (err) => {
    console.error(err.message);
});

app.on('message_processed', () => {
    // console.log('++ onMessageProcessed()');
});

module.exports = app;