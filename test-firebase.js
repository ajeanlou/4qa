// Simple Firebase connection test
// Run this with: node test-firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDrMn6jH1B8RqS8zKY_OwJMdg7GHg73UVs",
  authDomain: "statistics-1dfa4.firebaseapp.com",
  projectId: "statistics-1dfa4",
  storageBucket: "statistics-1dfa4.firebasestorage.app",
  messagingSenderId: "378114520818",
  appId: "1:378114520818:web:d2398525cc8bd3af41826b",
  measurementId: "G-00XW7JFVXT"
};

async function testFirebaseConnection() {
  try {
    console.log('🔍 Testing Firebase connection...');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized');
    
    // Initialize Firestore
    const db = getFirestore(app);
    console.log('✅ Firestore initialized');
    
    // Test reading from players collection
    console.log('📖 Testing read from players collection...');
    const querySnapshot = await getDocs(collection(db, 'players'));
    console.log(`✅ Successfully read ${querySnapshot.size} players from database`);
    
    // Log each player
    querySnapshot.forEach((doc) => {
      console.log(`Player: ${doc.id}`, doc.data());
    });
    
    console.log('🎉 Firebase connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
  }
}

testFirebaseConnection();
