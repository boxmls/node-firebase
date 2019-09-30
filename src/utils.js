'use strict';

const debug = require('debug')('boxmls-firebase-admin'),
      colors = require('colors');

Object.defineProperties( module.exports, {

  getFileCachePath: {
    value: function getFileCachePath(db,ref) {
      const md5 = require('md5'),
            fs = require('fs'),
            path = require('path');

      let cacheDir = process.env.FIREBASE_CACHE_DIR || require('temp-dir');
      cacheDir = cacheDir.replace(/\/$/, "");

      if(!fs.existsSync(cacheDir)) {
        require('mkdirp').sync(cacheDir);
      }

      let fileCachePath = `${cacheDir}/fba-${md5(db+ref)}.json`;
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