// src/firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // Firebase configuration (hidden for security)
  // Add your own config here before running locally.
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
//const analytics = getAnalytics(app);

export { db, ref, onValue };
