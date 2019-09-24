'use strict';

Object.defineProperties( module.exports, {

  firebaseAdmin: {
    /**
     * Returns new Firebase Admin API object
     * Wrapper for firebase-admin npm module with additional features
     *
     * @param args
     * @returns object
     */
    value: function firebaseAdmin(...args) {
      return new (require('./src/firebase-admin.js'))(...args);
    },
    enumerable: true,
    writable: true
  },

  version: {
    value: require('./package.json').version,
    writable: false
  }

});