'use strict';

const request  = require('request');
const endPoint = 'http://data.hazewatchapp.com/index.json';

var data;


function nextHour() {
  const now = new Date();
  return new Date().setHours(now.getHours() + 1, 0, 0, 0);
}

module.exports = function fetch(msg, next) {

  if (typeof msg === 'function') {
    next = msg;
  }

  console.log('fetching');

  if (!data || data.expiry < Date.now()) {

    request(endPoint, function (err, res, body) {

      if (err || res.statusCode !== 200) {
        return next(err);
      }

      console.log('fetched');

      let result = JSON.parse(body);
      if (!result) {
        return next(new Error('no data'));
      }

      data = {
        result: JSON.parse(body),
        expiry: nextHour()
      };

      next(null, msg, data.result);
    });
  } else {
    next(null, msg, data.result);
  }

};