const Kinesis = require('lifion-kinesis');
const cfg = require('./config').kinesis;

let kinesis;

function handleRecord(data) {
    // console.log('++ handleKinesisRecord()');

    for (const rec of data.records) {
        console.log('handleKinesisRecord: shard: %s, partition: %s, data: %s', data.shardId, rec.partitionKey, rec.data);
    }

    // console.log('-- handleKinesisRecord()');
}

module.exports = {
    start: () => {
        if (cfg.stream) {
            kinesis = new Kinesis({
                region: cfg.region,
                streamName: cfg.stream,
                consumerGroup: 'new-aws-demo-app'
            });

            kinesis.on('data', handleRecord);
            kinesis.startConsumer();

            console.log('Kinesis consumer started for stream:', cfg.stream);
        }
        else {
            console.log('No kinesis config found. Skipped.');
        }
    }
};
