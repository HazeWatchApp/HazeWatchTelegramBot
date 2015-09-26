'use strict';

const subsMap = 'haze-subscriptions';
const redis   = require('../helper/redis');

module.exports = function (bot) {

  return function (msg) {
    redis.hdel(subsMap, msg.chat.id);
    bot.sendMessage(msg.chat.id, 'okay, i\'ll stop annoying you');
  };

};