## 0.2.3

* Use specific `@firebase/database` version because of the bug in `0.5.14` version

## 0.2.2

* Store initialized application in global env and use it on trying to initialize app with the same parameters.
* Added suffix to Firestore collection names to split Production and Staging collections.