'use strict';

/**
 * TODO: not only localhost redis perhaps ?
 **/

const redis  = require('redis');
const client = redis.createClient();

module.exports = client;
