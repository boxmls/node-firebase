/**
 *
 */
const debug = require('debug')('mocha');

module.exports = {

  'before': function( done ) {
    done();
  },

  'firebaseAdmin': {

    'init with path and read the data': function ( done ) {
      this.timeout( 10000 );

      const firebase = require('../index.js');
      const fs = require('fs');
      const path = require('path');

      // Certificate can be path to file or stringified JSON object
      let defaultPath = `${path.dirname(__filename).split(path.sep).slice(0,-1).join(path.sep)}/gce-key.json`;
      let gceCert = process.env.FIREBASE_ADMIN_CERT || defaultPath;

      debug("FireBase Certificate [%s]", gceCert);

      if(!process.env.FIREBASE_ADMIN_DB) {
        return done(new Error("FIREBASE_ADMIN_DB env must be defined"));
      }

      if(!process.env.FIREBASE_ADMIN_REF) {
        return done(new Error("FIREBASE_ADMIN_REF env must be defined"));
      }

      const firebaseAdmin = firebase.firebaseAdmin(gceCert);

      firebaseAdmin.ready(()=>{
        let data = firebaseAdmin.get();
        //debug(require('util').inspect(data, {showHidden: false, depth: 10, colors: true}));
        data.should.be.an.instanceOf(Object);
        firebaseAdmin.exit();
        done();
      });

    }

  },

  'after': function( done ) {
    done();
  },

};
