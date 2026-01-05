// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEcr1oJ8gfDiGQvhw15ybizJ8L3y-wcjw",
  authDomain: "proteus-guardian.firebaseapp.com",
  projectId: "proteus-guardian",
  storageBucket: "proteus-guardian.firebasestorage.app",
  messagingSenderId: "595295313048",
  appId: "1:595295313048:web:94eda496a67421504a04ed",
  measurementId: "G-XWNDWMVMGJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();