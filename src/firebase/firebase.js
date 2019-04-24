import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth';

const API_KEY = process.env.REACT_APP_API_KEY
const AUTH_DOMAIN = process.env.REACT_APP_AUTH_DOMAIN
const DATABASE_URL = process.env.REACT_APP_DATABASE_URL
const PROJECT_ID = process.env.REACT_APP_PROJECT_ID
const STORAGE_BUCKET = process.env.REACT_APP_STORAGE_BUCKET
const MESSAGING_SENDER_ID = process.env.REACT_APP_MESSAGING_SENDER_ID

const config = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    databaseURL: DATABASE_URL,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID
};

const FIREBASE_APP = firebase.initializeApp(config);

//const db = FIREBASE_APP.database()

const auth = FIREBASE_APP.auth();

export {
  //db,
  auth,
};