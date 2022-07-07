const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const { arn } = require('./config').sns;

const snsClient = new SNSClient({ region: 'eu-central-1' });

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
        const durationType = i > 4 ? 'high' : 'low';

        // waitFor.push(
            await snsClient.send(
                new PublishCommand({
                    // MessageDeduplicationId: `_id-${i}`,
                    // MessageGroupId: 'main-group',
                    Message: `{ "sleep": ${i} }`,
                    TargetArn: arn,
                    MessageAttributes: {
                        "duration": {
                            DataType: 'String',
                            StringValue: durationType
                        }
                    }
                }))
        // );
        process.stdout.write(i+' ,');
    }

    // Promise.all(waitFor);
    console.log('\nDone generating %s events.', EventsTotal);
})();
