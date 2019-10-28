'use strict';

const debug = require('debug')('boxmls-firebase-admin'),
      admin = require('firebase-admin'),
      colors = require('colors'),
      fs = require('fs');

const firebaseAdmin = require('./firebaseAdmin.js');

module.exports = class firebaseAdminDatabase extends firebaseAdmin {

  /**
   * Constructor
   *
   * @param cert
   * @param db
   * @param ref
   */
  constructor(cert,db,ref) {
    super(cert,db);

    if(!ref) {
      throw new Error("Firebase Admin API can not be initialized due to missing refferal");
    }

    // Get a database reference to our posts
    this.db = this.app.database();
    this.ref = this.db.ref(ref);

    this.isReady = false;
    this.isExited = false;

    this.fileCachePath = require('./utils.js').getFileCachePath(db,ref);

    // Exit handlers
    process.on('exit', ()=>this.exit());
    //catches ctrl+c event
    process.on('SIGINT', ()=>this.exit());
    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', ()=>this.exit());
    process.on('SIGUSR2', ()=>this.exit());

    this.ref.on("value", (snapshot)=>{
      try {
        debug("Data changed. Saving data to %s file", colors.green(this.fileCachePath));
        fs.writeFile(this.fileCachePath, JSON.stringify(snapshot.val()), (err)=>{
          if(err || !(snapshot.val())){
            this.exit();
            throw ( err || (new Error("Data is not defined")) );
          }
          this.isReady = true;
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
      this.app.delete();
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