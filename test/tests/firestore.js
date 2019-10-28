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

const collection = "mochaTests",
      doc = "mochaTest"

module.exports = {

  'before': function(){
    if(!process.env.FIREBASE_ADMIN_DB) {
      return done(new Error("FIREBASE_ADMIN_DB env must be defined"));
    }
    if(!process.env.FIREBASE_ADMIN_REF) {
      return done(new Error("FIREBASE_ADMIN_REF env must be defined"));
    }
    module.exports.firestore = firebase.init('firestore',gceCert);
  },

  'create/update document in collection': function(done){
    this.timeout( 15000 );

    module.exports.firestore.setDocument(collection,doc,{
      name: 'Firestore Mocha Test',
      createdAt: Date.now()
    }, done);
  },

  'get document from collection': function(done) {
    this.timeout( 15000 );

    module.exports.firestore.getDocument(collection,doc,(err, data)=>{
      debug(data);
      data.should.be.an.instanceOf(Object);
      data.should.have.property('name');
      data.name.should.equal('Firestore Mocha Test');
      done();
    })
  },

  'list documents in collection': function(done) {
    this.timeout( 15000 );

    module.exports.firestore.listDocuments(collection,(err, data)=>{
      data.should.be.an.instanceOf(Array);
      data.should.have.length(1);
      done();
    })
  },

  'delete document from collection': function(done) {
    this.timeout( 15000 );

    module.exports.firestore.deleteDocument(collection,doc,done)
  }

};
