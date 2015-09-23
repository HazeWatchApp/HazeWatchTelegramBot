'use strict';

const lodash = require('lodash');

function concatR(prev, curr) {
  if (!prev) { return curr; }
  return prev + '\n' + curr;
}

module.exports = function (bot) {

  return function (err, msg, data) {

    data = lodash.chain(data)
             .pluck('negeri')
             .uniq()
             .sort()
             .reduce(concatR)
             .value();

    bot.sendMessage(msg.chat.id, data || 'No Data');
  }

};