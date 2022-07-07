const memjs = require('memjs');
const config = require('../config');

const client = memjs.Client.create(config.memcached.host);

console.log('Connected to memcached successfully');

module.exports = {
    memcached: client
}