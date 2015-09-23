'use strict';

const helpMessage = '/api <area> to get a list of areas\n' +
                    '/areas to get a list of areas available';


module.exports = function (bot) {
  return function (err, msg) {
    bot.sendMessage(msg.chat.id, helpMessage);
  }

};