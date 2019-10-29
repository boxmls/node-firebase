'use strict';

const admin = require('firebase-admin'),
      md5 = require('md5'),
      debug = require('debug')('boxmls-firebase-admin'),
      colors = require('colors');

global.nodeFirebaseAdminApps = {};

module.exports = class firebaseAdmin {

  /**
   * Constructor
   *
   * @param cert
   * @param db
   * @param ref
   */
  constructor(cert,db) {
    if(!cert || !db) {
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

    let params = {
      credential: admin.credential.cert(cert),
      databaseURL: `https://${db}.firebaseio.com`
    };

    this.appName = md5(JSON.stringify(params));

    if(global.nodeFirebaseAdminApps[this.appName]) {
      debug("Firebase application already initialized with name [%s] and stored in global env %s. Using it.", colors.green(this.appName), colors.bold('nodeFirebaseAdminApps'));
      this.app = global.nodeFirebaseAdminApps[this.appName];
    } else {
      debug("Initializing Firebase application. Unique name [%s]", colors.green(this.appName));
      this.app = global.nodeFirebaseAdminApps[this.appName] = admin.initializeApp(params, this.appName);
    }

  }

  /**
   * Remove initialized application
   * and delete its object from global env nodeFirebaseAdminApps
   *
   */
  exit() {
    try {
      this.app.delete().then(()=>{
        if(global.nodeFirebaseAdminApps[this.appName]) {
          debug("Removing the initialized application [%s] from global env %s", colors.green(this.appName), colors.bold('nodeFirebaseAdminApps'));
          delete global.nodeFirebaseAdminApps[this.appName];
        }
      });
    } catch(e) {
      // Ignore for now.
    }
  }

}