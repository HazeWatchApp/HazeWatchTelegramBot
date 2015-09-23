'use strict';

const lodash = require('lodash');

function concatR(prev, curr) {
  if (!prev) { return curr; }
  return prev + '\n' + curr;
}

module.exports = function (bot) {

  return function (err, msg, data) {

    const state = msg.text.replace('/areas', '').trim();

    data = lodash.chain(data)
             .filter('negeri', state)
             .pluck('lokasi')
             .uniq()
             .sort()
             .reduce(concatR)
             .value();

    bot.sendMessage(msg.chat.id, data || 'No Data');
  }

};