// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBluiE_6bd-SCgzs1FbtnBhBVVPSeow2Kc",
  authDomain: "grocery-a20c6.firebaseapp.com",
  projectId: "grocery-a20c6",
  storageBucket: "grocery-a20c6.appspot.com",
  messagingSenderId: "16655756236",
  appId: "1:16655756236:web:d1a9c80a38555fb30d8b69",
  measurementId: "G-WDPYHL4XYB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
