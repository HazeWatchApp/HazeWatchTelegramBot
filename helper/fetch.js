'use strict';

const request  = require('request');
const endPoint = 'http://data.hazewatchapp.com/index.json';

let data;

function nextHour() {
  const now = new Date();
  return new Date().setHours(now.getHours() + 1, 0, 0, 0);
}

module.exports = function fetch(msg, next) {

  if (typeof msg === 'function') {
    next = msg;
  }

  if (!data || data.expiry < Date.now()) {

    request(endPoint, function (err, res, body) {

      if (err || res.statusCode !== 200) {
        return next(err);
      }

      let doc = JSON.parse(body);
      if (!doc) {
        return next(new Error('no data'));
      }

      doc  = doc.result || doc;
      data = { result: doc,
               expiry: nextHour() };

      if (typeof msg === 'function') {
        return next(null, data.result);
      } else {
        return next(null, msg, data.result);
      }
    });

  } else {

    if (typeof msg === 'function') {
      next(null, data.result);
    } else {
      next(null, msg, data.result);
    }

  }

};
