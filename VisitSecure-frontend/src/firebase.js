// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4ae9-m1BQYPlIXEntpgKVEakPnXp3Uo4",
  authDomain: "visit-5763f.firebaseapp.com",
  databaseURL: "https://visit-5763f-default-rtdb.firebaseio.com",
  projectId: "visit-5763f",
  storageBucket: "visit-5763f.firebasestorage.app",
  messagingSenderId: "115405525952",
  appId: "1:115405525952:web:301e1d539e499b0f912e25",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
