
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "tws-community-hub",
  "appId": "1:193779370507:web:3436a7d135345cb3b5150e",
  "storageBucket": "tws-community-hub.firebasestorage.app",
  "apiKey": "AIzaSyC8eCUt1aZXQDqYXOAkj6F1gDTTUArNagA",
  "authDomain": "tws-community-hub.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "193779370507"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
