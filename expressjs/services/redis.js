const { createClient } = require('redis');
const config = require('../config');

let client;

if (config.redis.host) {
    client = createClient({ url: config.redis.host });

    client.on('error', (err) => console.log('Redis Client Error', err));


    (async () => {
        try {
            await client.connect();
        }
        catch(e) {
            console.log("Unable to connect to Redis: ", e);
            await client.disconnect();
        }
        console.log('Connected to redis successfully');
    }
    )();
}
else {
    console.log("No Redis configuration found. Skipping.");
}



module.exports = { redis: client };