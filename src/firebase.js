// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxBtbCJaTE4IbvxTvXFLkFrGey5jqVCdU",
  authDomain: "sigtecd.firebaseapp.com",
  projectId: "sigtecd",
  storageBucket: "sigtecd.firebasestorage.app",
  messagingSenderId: "925215616958",
  appId: "1:925215616958:web:559aba2296d76c5c5093ef",
  measurementId: "G-BPR0HZTQFB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);