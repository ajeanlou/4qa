import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'players';

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('🔍 Testing Firebase connection...');
    console.log('Database instance:', db);
    
    // Check if db is properly initialized
    if (!db) {
      throw new Error('Firestore database not initialized');
    }
    
    // Try to read from the players collection
    console.log('📖 Attempting to read from players collection...');
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    console.log('✅ Firebase connection successful!');
    console.log(`Found ${querySnapshot.size} players in database`);
    
    // Log each player for debugging
    querySnapshot.forEach((doc) => {
      console.log('Player:', doc.id, doc.data());
    });
    
    return { success: true, count: querySnapshot.size };
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    return { success: false, error: error.message };
  }
};

// Test Firebase write permissions
export const testFirebaseWrite = async () => {
  try {
    console.log('🧪 Testing Firebase write permissions...');
    
    // Try to write a test document
    const testData = {
      name: "Write Test",
      timestamp: new Date().toISOString(),
      test: true
    };
    
    console.log('📝 Attempting to write test document...');
    const docRef = await addDoc(collection(db, 'test'), testData);
    console.log('✅ Write test successful! Document ID:', docRef.id);
    
    // Clean up the test document
    console.log('🧹 Cleaning up test document...');
    await deleteDoc(doc(db, 'test', docRef.id));
    console.log('✅ Test document cleaned up');
    
    return { success: true, docId: docRef.id };
  } catch (error) {
    console.error('❌ Firebase write test failed:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    return { success: false, error: error.message };
  }
};

// Get all players
export const getPlayers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const players = [];
    querySnapshot.forEach((doc) => {
      players.push({ id: doc.id, ...doc.data() });
    });
    return players;
  } catch (error) {
    console.error('Error getting players:', error);
    throw error;
  }
};

// Add a new player
export const addPlayer = async (playerData) => {
  try {
    console.log('📝 Adding player to Firebase:', playerData);
    const docRef = await addDoc(collection(db, COLLECTION_NAME), playerData);
    console.log('✅ Player added successfully with ID:', docRef.id);
    return { id: docRef.id, ...playerData };
  } catch (error) {
    console.error('❌ Error adding player:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Update a player
export const updatePlayer = async (playerId, playerData) => {
  try {
    console.log('📝 Updating player in Firebase:', playerId, playerData);
    const playerRef = doc(db, COLLECTION_NAME, playerId);
    await updateDoc(playerRef, playerData);
    console.log('✅ Player updated successfully:', playerId);
    return { id: playerId, ...playerData };
  } catch (error) {
    console.error('❌ Error updating player:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

// Delete a player
export const deletePlayer = async (playerId) => {
  try {
    const playerRef = doc(db, COLLECTION_NAME, playerId);
    await deleteDoc(playerRef);
    return playerId;
  } catch (error) {
    console.error('Error deleting player:', error);
    throw error;
  }
};

// Real-time listener for players
export const subscribeToPlayers = (callback, errorCallback) => {
  try {
    console.log('🔗 Setting up real-time listener for players...');
    console.log('🔗 Collection name:', COLLECTION_NAME);
    console.log('🔗 Database instance:', db);
    
    // Check if db is properly initialized
    if (!db) {
      const error = new Error('Firestore database not initialized');
      console.error('❌ Database not initialized:', error);
      if (errorCallback) {
        errorCallback(error);
      }
      return () => {}; // Return empty unsubscribe function
    }
    
    const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
    console.log('🔗 Query created successfully');
    
    return onSnapshot(q, (querySnapshot) => {
      console.log('📡 Real-time update received:', querySnapshot.size, 'players');
      console.log('📡 Query snapshot metadata:', {
        fromCache: querySnapshot.metadata.fromCache,
        hasPendingWrites: querySnapshot.metadata.hasPendingWrites
      });
      
      const players = [];
      querySnapshot.forEach((doc) => {
        console.log('📄 Processing document:', doc.id, doc.data());
        players.push({ id: doc.id, ...doc.data() });
      });
      
      console.log('📡 Final players array:', players.length, 'players');
      console.log('📡 Players data:', players);
      
      callback(players);
    }, (error) => {
      console.error('❌ Error in real-time listener:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      if (errorCallback) {
        errorCallback(error);
      }
    });
  } catch (error) {
    console.error('❌ Error setting up real-time listener:', error);
    if (errorCallback) {
      errorCallback(error);
    }
    return () => {}; // Return empty unsubscribe function
  }
};

// Update player stats (wins/losses)
export const updatePlayerStats = async (playerId, wins, losses) => {
  try {
    console.log('📊 Updating player stats in Firebase:', playerId, { wins, losses });
    const playerRef = doc(db, COLLECTION_NAME, playerId);
    await updateDoc(playerRef, { wins, losses });
    console.log('✅ Player stats updated successfully:', playerId);
    return { id: playerId, wins, losses };
  } catch (error) {
    console.error('❌ Error updating player stats:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};
