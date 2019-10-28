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
    value: function init(type = 'database', cert = process.env.FIREBASE_ADMIN_CERT, db = process.env.FIREBASE_ADMIN_DB, ref = process.env.FIREBASE_ADMIN_REF) {
      let instance;
      try {
        switch (type) {
          case 'firestore':
            instance = new (require(`./src/firebaseAdminFirestore.js`))(cert,db);
            break;
          case 'database':
          default:
            instance = new (require(`./src/firebaseAdminDatabase.js`))(cert,db,ref);
        }
      } catch(e) {
        console.error(e);
        return null;
      }
      return instance;
    },
    enumerable: true,
    writable: true
  },

  getData: {
    /**
     * Returns the data from cache file.
     *
     * If process env is set - it will be returned instead. KEY to ENV pattern examples:
     * - 'custom.firebase_admin.env' key equals CUSTOM_FIREBASE_ADMIN_ENV
     * - 'custom_firebase_admin_env' key equals CUSTOM_FIREBASE_ADMIN_ENV
     * - 'hello.world' key equals HELLO_WORLD
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

      if(typeof key == 'string' && key) {
        const env = key.replace(/\./g,'_').toUpperCase();
        if(typeof process.env[env] == 'string') {
          return process.env[env];
        }
      }

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