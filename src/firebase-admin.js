'use strict';

const debug = require('debug')('boxmls-firebase-admin'),
      admin = require('firebase-admin'),
      colors = require('colors'),
      fs = require('fs');

module.exports = class firebaseAdmin {

  /**
   * Constructor
   *
   * @param cert
   * @param db
   * @param ref
   */
  constructor(cert,db,ref) {
    let self = this;

    if(!cert || !db || !ref) {
      throw new Error("Firebase Admin API can not be initialized due to invalid parameters");
    }

    // Certificate may be JSON itself instead of path to file. So we try to parse it.
    let certJSON;
    try {
      if(typeof cert == "string") {
        certJSON = JSON.parse(cert)
      }
    } catch(e) {}

    if(certJSON) {
      cert=certJSON;
    }

    this.admin = admin.initializeApp({
      credential: admin.credential.cert(cert),
      databaseURL: `https://${db}.firebaseio.com`
    });

    // Get a database reference to our posts
    this.db = admin.database();
    this.ref = this.db.ref(ref);

    this.isReady = false;

    this.fileCachePath = require('./utils.js').getFileCachePath(db,ref);

    this.ref.on("value", function(snapshot) {
      debug("Data changed");
      try {
        fs.writeFile(self.fileCachePath, JSON.stringify(snapshot.val()), (err)=>{
          if(err){
            throw err;
          }
          self.isReady = true;
        });
      } catch(e){
        console.error(e);
      }
    });

  }

  /**
   * Removes connection
   */
  exit(cb) {
    // Close connection
    this.ref.off();
    this.db.goOffline();
    // Exit firebase-admin
    this.admin.delete();
    // Remove file with data
    if(cb) {
      fs.unlink(this.fileCachePath, cb);
    } else {
      fs.unlinkSync(this.fileCachePath);
    }
  }

  /**
   * Executes callback when data retrieved from DB.
   *
   * @param cb
   */
  ready(cb) {
    const timeout = 500;
    if(!this.isReady) {
      debug("Data is not ready yet. Waiting %s ms until next attempt", colors.bold(timeout));
      setTimeout(()=>{
        this.ready(cb);
      },timeout);
      return;
    }
    cb();
  }

}