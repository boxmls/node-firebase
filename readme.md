## Environments

* `FIREBASE_ADMIN_CERT`. Optional. Path to GCE Certificate file or Certificate itself (JSON) 
* `FIREBASE_ADMIN_DB`. Optional. Database name which is used to generate Database URL using the pattern `https://{DATABASENAME}.firebaseio.com`.
* `FIREBASE_ADMIN_REF`. Optional. Database Resource Referal.

## Tests

### Example

Check the connection to Database using the path to service account JSON file:

```
FIREBASE_ADMIN_CERT='/Users/name/gce-key.json' FIREBASE_ADMIN_DB='database-name' FIREBASE_ADMIN_REF='resource' npm test
```

Check the connection to Database using the service account stringified JSON:

```
FIREBASE_ADMIN_CERT='{"type":"service_account","project_id":"project-name","private_key_id":"qefqefnwekjfweklfwelkfwlekfjlwkefnlwekjf","private_key": ... "client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-saadsad91233.iam.gserviceaccount.com"}' FIREBASE_ADMIN_DB='database-name' FIREBASE_ADMIN_REF='resource' npm test
```