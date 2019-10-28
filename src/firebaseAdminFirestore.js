'use strict';

const debug = require('debug')('boxmls-firebase-admin'),
      firebaseAdmin = require('./firebaseAdmin.js');

module.exports = class firebaseAdminFirestore extends firebaseAdmin {

  /**
   * Constructor
   *
   * @param cert
   * @param db
   * @param ref
   */
  constructor(cert,db) {
    super(cert,db);
    this.firestore = this.app.firestore();
  }

  /**
   *
   * @returns {firebaseAdmin.firestore}
   */
  firestore(){
    return this.firestore;
  }

  /**
   * Retrieves the list of documents in collection.
   *
   * API Reference: https://googleapis.dev/nodejs/firestore/latest/CollectionReference.html#listDocuments
   *
   * @param collection
   * @param callback
   * @returns {*}
   */
  listDocuments(collection, callback) {
    let promise = this.firestore
      .collection(collection)
      .listDocuments()
      .then(documentRefs => {
        return this.firestore.getAll(...documentRefs);
      });

    if(typeof callback == 'function') {
      promise
        .then(documentSnapshots => {
          let documents = [];
          for (let documentSnapshot of documentSnapshots) {
            if (documentSnapshot.exists) {
              documents.push(documentSnapshot.data());
            } else {
              debug(`Found missing document: ${documentSnapshot.id}`);
            }
          }
          callback(null, documents);
        });
    } else {
      return promise;
    }

  }

  /**
   * Creates/Updates the document in Firestoree collection
   *
   * API Reference: https://googleapis.dev/nodejs/firestore/latest/DocumentReference.html#set
   *
   * @param collection
   * @param doc. Unique ID of document
   * @param data
   * @param callback
   * @returns {Promise.<WriteResult>}
   */
  setDocument(collection,doc,data,callback){
    let promise = this.firestore
      .collection(collection)
      .doc(doc)
      .set(data);

    if(typeof callback == 'function') {
      promise
        .then(resp=>callback())
        .catch(error => callback(error));
    } else {
      return promise;
    }
  }

  /**
   * Retrieves the data of document from Firestore collection
   *
   * API Reference: https://googleapis.dev/nodejs/firestore/latest/DocumentReference.html#get
   *
   * @param collection
   * @param doc. Unique ID of document
   * @param callback
   * @returns {Promise.<DocumentSnapshot>}
   */
  getDocument(collection,doc,callback){
    let promise = this.firestore
      .collection(collection)
      .doc(doc)
      .get();

    if(typeof callback == 'function') {
      promise
        .then(snapshot=>callback(null, snapshot.data()))
        .catch(error=>callback(error))
    } else {
      return promise;
    }
  }

  /**
   *
   * API Reference:
   *
   * @param collection
   * @param doc. Unique ID of document
   * @param callback
   * @returns {Promise.<WriteResult>}
   */
  deleteDocument(collection,doc,callback){
    let promise = this.firestore
      .collection(collection)
      .doc(doc)
      .delete();

    if(typeof callback == 'function') {
      promise
        .then(resp=>callback())
        .catch(error=>callback(error))
    } else {
      return promise;
    }
  }

}