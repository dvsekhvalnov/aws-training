const Kinesis = require('lifion-kinesis');
const cfg = require('./config').kinesis;

// AWS.config.update({ region: cfg.region });

const EventsCount = 1000;

const EventTypes = ['signup', 'login', 'logoff'];

function random(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    );
}

kinesis = new Kinesis({
    region: cfg.region,
    streamName: cfg.stream
});

(async () => {


    for (let i = 0; i < EventsCount; i++) {
        const msg = JSON.stringify({
            "event": EventTypes[random(0,2)],
            "username": `user-${i}`
        });

        // const pk = (i % 2) ? 'odd' : 'even';
        const pk = "" + random(1, 100);

        kinesis.putRecord({
            data: msg,
            streamName: cfg.streamName,
            partitionKey: pk
        });
    }

    // console.log(response);
})();


