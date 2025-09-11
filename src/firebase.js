// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDrMn6jH1B8RqS8zKY_OwJMdg7GHg73UVs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "statistics-1dfa4.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "statistics-1dfa4",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "statistics-1dfa4.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "378114520818",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:378114520818:web:d2398525cc8bd3af41826b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-00XW7JFVXT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics (only in production or when explicitly enabled)
let analytics = null;
if (typeof window !== 'undefined' && (import.meta.env.PROD || import.meta.env.VITE_ENABLE_ANALYTICS === 'true')) {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}

// Initialize Firestore Database (using standard getFirestore instead of initializeFirestore)
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;