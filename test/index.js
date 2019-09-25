/**
 *
 */
const debug = require('debug')('boxmls-firebase-admin-test'),
      colors = require('colors'),
      firebase = require('../index.js');

module.exports = {

  'firebaseAdmin': {

    'init, read the data and exit': function ( done ) {
      this.timeout( 15000 );

      const fs = require('fs');
      const path = require('path');

      // Certificate can be path to file or stringified JSON object
      let defaultPath = `${path.dirname(__filename).split(path.sep).slice(0,-1).join(path.sep)}/gce-key.json`;
      let gceCert = process.env.FIREBASE_ADMIN_CERT || defaultPath;

      //debug("FireBase Certificate is [%s]", colors.green(gceCert));

      if(!process.env.FIREBASE_ADMIN_DB) {
        return done(new Error("FIREBASE_ADMIN_DB env must be defined"));
      }

      if(!process.env.FIREBASE_ADMIN_REF) {
        return done(new Error("FIREBASE_ADMIN_REF env must be defined"));
      }

      const firebaseAdmin = firebase.firebaseAdmin(gceCert);

      firebaseAdmin.ready(()=>{
        let data = firebase.getData();
        //debug(require('util').inspect(data, {showHidden: false, depth: 10, colors: true}));
        data.should.be.an.instanceOf(Object);
        data.should.have.property('test');
        data.test.should.equal('Hello World!');
        firebaseAdmin.exit((err)=>{
          debug("FireBase cache file removed");
          done(err);
        });
      });

    },

    'removes cache on exit': function () {
      let data = firebase.getData(null,'not exist');
      data.should.be.equal('not exist');
    }

  }

};
