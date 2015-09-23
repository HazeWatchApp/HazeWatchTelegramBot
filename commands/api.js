'use strict';

const lodash = require('lodash');

function concatR(prev, curr) {
  if (!prev) { return curr; }
  return prev + '\n' + curr;
}

module.exports = function (bot) {

  return function (err, msg, data) {

    const area = msg.text.replace('/api', '').trim();

    data = lodash.chain(data)
             .filter('lokasi', area)
             .pluck('latest')
             .last()
             .value();

    if (!data) {
      return bot.sendMessage(msg.chat.id, 'No Data');
    }

    bot.sendMessage(msg.chat.id, area + ' -  API:' + data.index + ' @ ' + data.time);
  }

};