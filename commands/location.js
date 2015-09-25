'use strict';

const lodash = require('lodash');

// Latitude   - Y
// Longitude  - X
function getDistance(coor1, coor2) {

  let x1 = parseFloat(coor1.longitude);
  let y1 = parseFloat(coor1.latitude);
  let x2 = parseFloat(coor2.longitude);
  let y2 = parseFloat(coor2.latitude);

  return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
}

module.exports = function (bot) {

  return function (err, msg, data) {

    const base = msg.location;

    data = lodash.min(data, function (e) {
      return getDistance(base, e.location.coordinates)
    });

    if (!data) {
      return bot.sendMessage(msg.chat.id, 'No Data');
    }

    const area = data.lokasi;
          data = data.latest;

    bot.sendMessage(msg.chat.id, area + ' -  API:' + data.index + ' @ ' + data.time);

  };

};
