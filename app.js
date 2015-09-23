'use strict';

const TelegramBot = require('node-telegram-bot-api');
const fetch       = require('./helper/fetch');
const token       = require('./key');


const bot    = new TelegramBot(token, {polling: true});
const help   = require('./commands/help')(bot);
const negeri = require('./commands/negeri')(bot);
const areas  = require('./commands/areas')(bot);
const api    = require('./commands/api')(bot);


bot.on('text', function (msg) {

  console.log(msg);
  const text = msg.text;

  if (text.indexOf('/help')   === 0) { return help(null, msg);    }
  if (text.indexOf('/negeri') === 0) { return fetch(msg, negeri); }
  if (text.indexOf('/areas')  === 0) { return fetch(msg, areas);  }
  if (text.indexOf('/api')    === 0) { return fetch(msg, api);    }

});
