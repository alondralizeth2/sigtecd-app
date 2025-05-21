import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBxBtbCJaTE4IbvxTvXFLkFrGey5jqVCdU",
  authDomain: "sigtecd.firebaseapp.com",
  projectId: "sigtecd",
  storageBucket: "sigtecd.firebasestorage.app",
  messagingSenderId: "925215616958",
  appId: "1:925215616958:web:559aba2296d76c5c5093ef",
  measurementId: "G-BPR0HZTQFB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);