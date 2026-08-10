import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD_PbW9ybnDFoHK7LczyloH1bvwRKc-3qg",
  authDomain: "ins-cs.firebaseapp.com",
  projectId: "ins-cs",
  storageBucket: "ins-cs.firebasestorage.app",
  messagingSenderId: "214347598189",
  appId: "1:214347598189:web:a026d4aa899d21483eb264",
  measurementId: "G-EJTM6MWLXR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
