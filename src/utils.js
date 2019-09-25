'use strict';

const debug = require('debug')('boxmls-firebase-admin'),
      colors = require('colors');

Object.defineProperties( module.exports, {

  getFileCachePath: {
    value: function getFileCachePath(db,ref) {
      const md5 = require('md5'),
            path = require('path'),
            appDir = path.dirname(require.main.filename);
      let fileCachePath = `${appDir}/fba-${md5(db+ref)}.json`;
      //debug("getFileCachePath [%s]", colors.green(fileCachePath));
      return fileCachePath;
    },
    enumerable: true,
    writable: true
  },

  version: {
    value: require('../package.json').version,
    writable: false
  }

});