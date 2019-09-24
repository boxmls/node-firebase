'use strict';

const debug = require('debug')('firebaseAdmin'),
      admin = require('firebase-admin'),
      _ = require('lodash');

module.exports = class firebaseAdmin {

  /**
   * Constructor
   *
   * @param apiKey
   */
  constructor(cert = process.env.FIREBASE_ADMIN_CERT, db = process.env.FIREBASE_ADMIN_DB, ref = process.env.FIREBASE_ADMIN_REF) {
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

    this.ref.on("value", function(snapshot) {
      debug("Data changed");
      self._data = snapshot.val();
    });

  }

  /**
   * Removes connection
   */
  exit() {
    this.ref.off();
    this.db.goOffline();
    this.admin.delete();
  }

  /**
   * Executes callback when data retrieved from DB.
   *
   * @param cb
   */
  ready(cb) {
    if(!this._data) {
      setTimeout(()=>{
        this.ready(cb);
      },100);
      return;
    }
    cb();
  }

  /**
   * Just a wrapper
   * Retrieves data
   *
   * @param map
   * @returns {*}
   */
  get(map) {
    return !map ? this._data : _.get( this._data, map )
  }

}