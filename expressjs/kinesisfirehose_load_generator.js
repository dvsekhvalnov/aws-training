const { FirehoseClient, PutRecordBatchCommand, PutRecordCommand } = require("@aws-sdk/client-firehose");
const cfg = require('./config').firehose;

const firehose = new FirehoseClient({ region: cfg.region });

const EventsCount = 1000;

const EventTypes = ['signup', 'login', 'logoff'];

function random(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    );
}

(async () => {
    for (let i = 0; i < EventsCount; i++) {
        const msg = JSON.stringify({
            "event": EventTypes[random(0, 2)],
            "username": `user-${i}`
        });

        const command = new PutRecordCommand({
            DeliveryStreamName: cfg.stream,
            Record: {
                Data: new TextEncoder().encode(msg)
            }
        });

        firehose.send(command);
    }
})();