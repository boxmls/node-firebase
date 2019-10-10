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
    this.isExited = false;

    this.fileCachePath = require('./utils.js').getFileCachePath(db,ref);

    // Exit handlers
    process.on('exit', ()=>self.exit());
    //catches ctrl+c event
    process.on('SIGINT', ()=>self.exit());
    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', ()=>self.exit());
    process.on('SIGUSR2', ()=>self.exit());

    this.ref.on("value", function(snapshot) {
      try {
        debug("Data changed. Saving data to %s file", colors.green(self.fileCachePath));
        fs.writeFile(self.fileCachePath, JSON.stringify(snapshot.val()), (err)=>{
          if(err || !(snapshot.val())){
            self.exit();
            throw ( err || (new Error("Data is not defined")) );
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
  exit(cb=null) {
    // Boolean. Remove or not cache file on exit.
    const clean = ( process.env.FIREBASE_ADMIN_CACHE_CLEAN && ['true','1'].indexOf(process.env.FIREBASE_ADMIN_CACHE_CLEAN) > - 1 )
      ? true : false;
    try {
      this.isExited = true;
      // Close connection
      //this.ref.off();
      //this.db.goOffline();
      // Exit firebase-admin
      this.admin.delete();
      // Remove file with data
      if(typeof cb == 'function') {
        if(clean && fs.existsSync(this.fileCachePath)) {
          fs.unlink(this.fileCachePath, cb);
        } else {
          cb();
        }
      } else {
        if(clean && fs.existsSync(this.fileCachePath)) {
          fs.unlinkSync(this.fileCachePath);
        }
      }
    } catch(e) {
      //console.error(e);
    }
  }

  /**
   * Executes callback when data retrieved from DB.
   *
   * @param cb
   */
  ready(cb) {
    const timeout = 500;
    if(!this.isReady && !this.isExited) {
      debug("Data is not ready yet. Waiting %s ms until next attempt", colors.bold(timeout));
      setTimeout(()=>{
        this.ready(cb);
      },timeout);
      return;
    }
    cb();
  }

}