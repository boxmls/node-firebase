'use strict';

const _ = require('lodash'),
      fs = require('fs');

Object.defineProperties( module.exports, {

  init: {
    /**
     * Returns new Firebase Admin API object
     * Wrapper for firebase-admin npm module with additional features
     *
     * @param args
     * @returns object
     */
    value: function init(cert = process.env.FIREBASE_ADMIN_CERT, db = process.env.FIREBASE_ADMIN_DB, ref = process.env.FIREBASE_ADMIN_REF) {
      return new (require('./src/firebase-admin.js'))(cert,db,ref);
    },
    enumerable: true,
    writable: true
  },

  getData: {
    /**
     * Returns the data from cache file
     *
     * @param key
     * @param def Default value if data does not exist
     * @param db
     * @param ref
     * @returns {*}
     */
    value: function getData(key = null, def = null, db = process.env.FIREBASE_ADMIN_DB, ref = process.env.FIREBASE_ADMIN_REF) {
      let data;
      let path = require('./src/utils.js').getFileCachePath(db,ref);
      if(fs.existsSync(path)) {
        data = require(path);
      }
      if(!data) {
        return def;
      }
      return key ? _.get(data,key,def) : data;
    },
    enumerable: true,
    writable: true
  },

  version: {
    value: require('./package.json').version,
    writable: false
  }

});