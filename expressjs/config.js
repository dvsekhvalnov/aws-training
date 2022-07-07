const env = process.env;

module.exports = {
    region: 'eu-central-1',
    db: {
        host: process.env.RDS_HOSTNAME || '127.0.0.1',
        user: process.env.RDS_USERNAME || 'expressjsdemo',
        password: process.env.RDS_PASSWORD || 'expressjsdemo',
        port: process.env.RDS_PORT || 3306,
        database: process.env.RDS_DB_NAME || 'fifa-2021'
    },
    redis: {
        // host: env.REDIS_URL || 'redis://:@127.0.0.1:6379'
    },
    memcached: {
        host: env.MEMCACHED_URL || 'localhost:11211'
    },
    cache: {
        ttl: 10
    },
    metadata: {
        url: 'http://169.254.169.254/latest/meta-data/'
    },
    s3: {
        bucket: 'dvpro-expressdemo',
        region: 'eu-central-1'
        // useAccelerateEndpoint: true
    },
    cloudfront: {
        distributionUrl: 'https://d599b3qvhdr0u.cloudfront.net',
        keyId: 'K20A2Q0KHG2QL9'
    },
    sqs: {
        region: 'eu-central-1',
        // url: 'https://sqs.eu-central-1.amazonaws.com/123331553797/demo.fifo',
        url: 'https://sqs.eu-central-1.amazonaws.com/123331553797/sqs-eu-central-1-dvpro-expressdemo',

        requrl: 'https://sqs.eu-central-1.amazonaws.com/123331553797/sqs-eu-central-1_myfriend-reqs',
        respurl: 'https://sqs.eu-central-1.amazonaws.com/123331553797/sqs-eu-central-1_myfriend-resps',
        processRequests: false,
        processReplies: true
    },
    sns: {
        region: 'eu-central-1',
        // arn: 'arn:aws:sns:eu-central-1:123331553797:demo.fifo'
        arn: 'arn:aws:sns:eu-central-1:123331553797:sns-eu-central-sleep-em-all'
    },
    kinesis: {
        region: 'eu-central-1',
        stream: 'ds-eu-central-1-test2'
    },
    firehose: {
        region: 'eu-central-1',
        stream: 'PUT-S3-LNHU5'
    }
};