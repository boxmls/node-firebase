![image](https://user-images.githubusercontent.com/308489/57512890-9acacc00-7315-11e9-854f-ad77da4d2742.png)

[![CircleCI](https://circleci.com/gh/boxmls/node-firebase-admin/tree/master.svg?style=svg)](https://circleci.com/gh/boxmls/node-firebase-admin/tree/master)

# BoxMLS Firebase Admin Node.js SDK

`boxmls-firebase-admin` module is the wrapper for [firebase-admin](https://www.npmjs.com/package/firebase-admin) module.
 
 It's designed to:
 * Minimize nested code of application initialization.
 * Prevent starting initialization in multiple places.
 * Easily add/update/delete/list documents in Firestore collections.
 * Easily pull data from [Firebase Realtime Database](https://firebase.google.com/docs/database/) (FRD)
 * Access FRD data across the application synchronously.
 * Ability to redeclare FRD data by `process.env`.

## Installation

To add the module to BoxMLS service ( to install module and add it to `package.json`):
 
```
npm install --save https://github.com/boxmls/node-firebase-admin.git#0.2.1
```

## Environments

* `FIREBASE_ADMIN_CERT`. Optional. Path to GCE Certificate file or Certificate itself (JSON) 
* `FIREBASE_ADMIN_DB`. Optional. Database name which is used to generate Database URL using the pattern `https://{DATABASENAME}.firebaseio.com`.
* `FIREBASE_ADMIN_REF`. Optional. Database Resource Referal.
* `FIREBASE_CACHE_DIR`. Optional. The directory where cache file with firebase data will be stored.
* `FIREBASE_ADMIN_CACHE_CLEAN`. Optional. Remove cache file on process exit or not. Default `false`, - not remove.

## Usage

### Realtime Database

* Firebase Admin [Realtime Database](https://console.firebase.google.com/) can be used to store options similar to environments. 
* On starting a service,the module should be initialized. So, any option may be retrieved in service later.

Option may be redeclared by `process.env` using KEY to ENV pattern. Examples:
* `custom.firebase_admin.env` key equals `CUSTOM_FIREBASE_ADMIN_ENV`
* `custom_firebase_admin_env` key equals `CUSTOM_FIREBASE_ADMIN_ENV`
* `hello.world` key equals `HELLO_WORLD`

#### Examples

General initialization (e.g.: on server start)

```js
const firebaseAdmin = require('boxmls-firebase-admin');
// If the following environments provided, you can ignore initialization parameters:
// FIREBASE_ADMIN_CERT, FIREBASE_ADMIN_DB, FIREBASE_ADMIN_REF
const firebaseAdminDatabase = firebaseAdmin.init('database');

// On successful initialization and pulling the data
firebaseAdminDatabase.ready(()=>{
	// Retrieve the data
	let data = firebaseAdmin.getData();
});
```

Retrieve the data in any place of code:
 
```js
let data = require('boxmls-firebase-admin').getData();
```

Retrieve the specific value of data by key:

```js
// Note: if process.env.SOME_PATH_TO_FILE defined, 
// the value will be returned from the env instead of Firebase
let data = require('boxmls-firebase-admin').getData('some.path.to.value');
```

### Cloud Firestore

* Simplified SDK for managing documents in collections

#### Examples

```js
const firbaseAdminFirestore = require('boxmls-firebase-admin').init('firestore');

// Add/update document
firbaseAdminFirestore.setDocument('collectionName', 'documentID', {
	name: 'Firestore Mocha Test',
	createdAt: Date.now()
}, callback );

// Retrieve document
firbaseAdminFirestore.getDocument('collectionName', 'documentID', callback);

// Delete document
firbaseAdminFirestore.deleteDocument('collectionName', 'documentID', callback);

// Retrieve list of documents in collection
firbaseAdminFirestore.listDocuments('collectionName', callback);
```

## Tests

### Examples

Check the connection to Database using the path to service account JSON file:

```
FIREBASE_ADMIN_CERT='/Users/name/gce-key.json' FIREBASE_ADMIN_DB='database-name' FIREBASE_ADMIN_REF='resource' npm test
```

Check the connection to Database using the service account stringified JSON:

```
FIREBASE_ADMIN_CERT='{"type":"service_account","project_id":"project-name","private_key_id":"qefqefnwekjfweklfwelkfwlekfjlwkefnlwekjf","private_key": ... "client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-saadsad91233.iam.gserviceaccount.com"}' FIREBASE_ADMIN_DB='database-name' FIREBASE_ADMIN_REF='resource' npm test
```