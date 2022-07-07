const { SNSClient, ConfirmSubscriptionCommand } = require("@aws-sdk/client-sns");
const express = require('express');
const router = express.Router();
const cfg = require('./config').sns;

const client = new SNSClient({ region: cfg.region });

router.post('/inbound', async (req, resp) => {
    const msg = req.body;

    // verify that message is coming from SNS
    console.log('++ onSnsMessage(): msg = ', msg);

    if ('SubscriptionConfirmation' === msg.Type) {
        console.log('onSnsMessage(): confirming subscription');

        const response = await client.send(new ConfirmSubscriptionCommand({
            Token: msg.Token,
            TopicArn: req.headers['x-amz-sns-topic-arn']
        }));

        console.log('onSnsMessage(): confirm response = ', response);
    }
    else if ('Notification' === msg.Type) {
        console.log('onSnsMessage(): got notification');
    }
    else if ('UnsubscribeConfirmation' === msg.Type) {
        console.log('onSnsMessage(): got unsubsribe notificatino');
    }

    return resp.json({
        status: 'done'
    });
});

module.exports = router;