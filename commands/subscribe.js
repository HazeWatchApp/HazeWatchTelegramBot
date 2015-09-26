'use strict';

const subsMap = 'haze-subscriptions';
const redis   = require('../helper/redis');
const fetch   = require('../helper/fetch');
const lodash  = require('lodash');
const async   = require('async');


function subscribe(chatID, area, threshold) {

  redis.hget(subsMap, chatID, function (err, result) {
    result       = result ? JSON.parse(result) : {};
    result[area] = threshold;

    redis.hset(subsMap, chatID, JSON.stringify(result));
  });
}

function parseText(text) {

  const splitted  = text.split(' ');
  const threshold = parseInt(splitted[splitted.length - 1]);
  const area      = text.replace(threshold, '').trim();

  return {area: area, threshold: threshold};
}

function notify(bot, next) {

  function getIndex(data, area){
    return lodash.chain(data)
             .filter('lokasi', area)
             .pluck('latest')
             .last()
             .value();
  }

  function processSub(data, chatID, chatSub) {
    let area;
    for (area in chatSub) {
      const threshold = chatSub[area];
      const api       = getIndex(data, area).index;
      console.log(api, threshold, area);
      if (api >= threshold) {
        bot.sendMessage(chatID, 'Hey man, it\'s getting kinda hazy at ' + area + ' the API is at ' + api );
      }
    }
  }

  async.waterfall([
    function (done) { fetch(done); },
    function (data, done) {

      redis.hgetall(subsMap, function (err, results) {
        let chatID;
        for(chatID in results) {
          const chatSub = JSON.parse(results[chatID]);
          processSub(data, chatID, chatSub);
        }

        done();
      });

    }
  ], function () {
    next();
  });

}


module.exports = function (bot) {

  (function heartbeat() {
    notify(bot, function () {
      setTimeout(heartbeat, 3600000);
    });
  }());

  return function (msg) {
    let request = msg.text.replace('/subscribe', '').trim();
        request = parseText(request);

    subscribe(msg.chat.id, request.area, request.threshold);

    bot.sendMessage(msg.chat.id, 'okay, you\'re now subscribe to alerts for '
                                  + request.area + ' @ ' + request.threshold);
  };

};