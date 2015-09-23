'use strict';

/**
 * Do not commit this with actual keys lol.
 */

const env  = process.env.NODE_ENV || 'development';
const keys = {
   "production": "token goes here",
  "development": "token goes here"
};

module.exports = keys[env];
