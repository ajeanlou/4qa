// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrMn6jH1B8RqS8zKY_OwJMdg7GHg73UVs",
  authDomain: "statistics-1dfa4.firebaseapp.com",
  projectId: "statistics-1dfa4",
  storageBucket: "statistics-1dfa4.firebasestorage.app",
  messagingSenderId: "378114520818",
  appId: "1:378114520818:web:d2398525cc8bd3af41826b",
  measurementId: "G-00XW7JFVXT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics
const analytics = getAnalytics(app);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;