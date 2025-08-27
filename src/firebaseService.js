import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'players';

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
    const docRef = await addDoc(collection(db, COLLECTION_NAME), playerData);
    return { id: docRef.id, ...playerData };
  } catch (error) {
    console.error('Error adding player:', error);
    throw error;
  }
};

// Update a player
export const updatePlayer = async (playerId, playerData) => {
  try {
    const playerRef = doc(db, COLLECTION_NAME, playerId);
    await updateDoc(playerRef, playerData);
    return { id: playerId, ...playerData };
  } catch (error) {
    console.error('Error updating player:', error);
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
export const subscribeToPlayers = (callback) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
  
  return onSnapshot(q, (querySnapshot) => {
    const players = [];
    querySnapshot.forEach((doc) => {
      players.push({ id: doc.id, ...doc.data() });
    });
    callback(players);
  }, (error) => {
    console.error('Error listening to players:', error);
  });
};

// Update player stats (wins/losses)
export const updatePlayerStats = async (playerId, wins, losses) => {
  try {
    const playerRef = doc(db, COLLECTION_NAME, playerId);
    await updateDoc(playerRef, { wins, losses });
    return { id: playerId, wins, losses };
  } catch (error) {
    console.error('Error updating player stats:', error);
    throw error;
  }
};
