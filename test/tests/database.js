/**
 *
 */
const debug = require('debug')('boxmls-firebase-admin-test'),
      colors = require('colors'),
      fs = require('fs'),
      path = require('path'),
      firebase = require('../../index.js');

// Certificate can be path to file or stringified JSON object
let defaultPath = `${path.dirname(__filename).split(path.sep).slice(0,-2).join(path.sep)}/gce-key.json`;
let gceCert = process.env.FIREBASE_ADMIN_CERT || defaultPath;

module.exports = {

  'read the data from process env': function() {
    // ENV is set in package.json See scripts.test
    let data = firebase.getData('custom.firebase_admin.env','not exist');
    data.should.be.equal('Hello World!');
  },

  'init, read the data and exit': function ( done ) {
    this.timeout( 15000 );

    //debug("FireBase Certificate is [%s]", colors.green(gceCert));

    if(!process.env.FIREBASE_ADMIN_DB) {
      return done(new Error("FIREBASE_ADMIN_DB env must be defined"));
    }

    if(!process.env.FIREBASE_ADMIN_REF) {
      return done(new Error("FIREBASE_ADMIN_REF env must be defined"));
    }

    const firebaseDatabase = firebase.init('database',gceCert);

    firebaseDatabase.ready(()=>{
      let data = firebase.getData();
      //debug(require('util').inspect(data, {showHidden: false, depth: 10, colors: true}));
      data.should.be.an.instanceOf(Object);
      data.should.have.property('test');
      data.test.should.equal('Hello World!');
      firebaseDatabase.exit((err)=>{
        debug("FireBase Database cache file removed");
        done(err);
      });
    });

  },

  'removes cache on exit': function () {
    let data = firebase.getData(null,'not exist');
    data.should.be.equal('not exist');
  }

};
