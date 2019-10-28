'use strict';

const admin = require('firebase-admin');

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

    this.app = admin.initializeApp({
      credential: admin.credential.cert(cert),
      databaseURL: `https://${db}.firebaseio.com`
    });

  }

}