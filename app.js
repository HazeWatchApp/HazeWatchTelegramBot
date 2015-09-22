'use strict';

const TelegramBot = require('node-telegram-bot-api');
const request     = require('request');
const lodash      = require('lodash');
const token       = require('./key');

const endPoint    = 'http://data.hazewatchapp.com/index.json';
const helpMessage = '/api <area> to get a list of areas\n' +
                    '/areas to get a list of areas available';


function fetch(next) {
  request(endPoint, function (err, res, body) {
    if (err || res.statusCode !== 200) {
      return;
    }
    next(JSON.parse(body));
  });
}

function concatR(prev, curr) {
  if (!prev) { return curr; }
  return prev + ', ' + curr;
}


const bot = new TelegramBot(token, {polling: true});
      bot.on('text', function (msg) {

        const chatId = msg.chat.id;
        const text   = msg.text;
        const area   = text.replace('/api', '');
        const find   = area.toLowerCase().trim();

        function matcher(e) {
          return e.lokasi.toLowerCase().trim() === find;
        }


        if (text === '/help') {
          bot.sendMessage(chatId, helpMessage);
        }

        if (text === '/areas') {
          fetch(function (data) {
            data = lodash.chain(data)
                     .pluck('lokasi')
                     .uniq()
                     .sort()
                     .reduce(concatR, undefined)
                     .value();

            bot.sendMessage(chatId, data);
          });
        }

        if (text.indexOf('/api') === 0) {
          fetch(function (data) {
            data = lodash.chain(data)
                     .find(matcher)
                     .last()
                     .value();

            if (!data) { return; }

            const latest = data.latest;
            bot.sendMessage(chatId, area + ' -  API:' + latest.index + ' @ ' + latest.time);
          });
        }

      });
