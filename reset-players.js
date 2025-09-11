// Script to completely reset players to 15 unique players with 0-0 records
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrMn6jH1B8RqS8zKY_OwJMdg7GHg73UVs",
  authDomain: "statistics-1dfa4.firebaseapp.com",
  projectId: "statistics-1dfa4",
  storageBucket: "statistics-1dfa4.firebasestorage.app",
  messagingSenderId: "378114520818",
  appId: "1:378114520818:web:d2398525cc8bd3af41826b",
  measurementId: "G-00XW7JFVXT"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Define the 15 unique players with 0-0 records
const uniquePlayers = [
  {
    name: "Adrian Thomas",
    position: "F",
    htwt: "6'3, 195lbs",
    college: "University of Miami",
    birthplace: "Orlando, FL",
    experience: "6th Season",
    awards: "MVP 2021",
    status: "Active",
    wins: 0,
    losses: 0
  },
  {
    name: "Amani Jean-Louis",
    position: "G",
    htwt: "6'0, 185lbs",
    college: "University of Florida",
    birthplace: "Miami, FL",
    experience: "5th Season",
    awards: "All-Star 2023",
    status: "Active",
    wins: 0,
    losses: 0
  },
  {
    name: "Blake Schultz",
    position: "F",
    htwt: "6'3, 195lbs",
    college: "Eckerd College",
    birthplace: "Clearwater, FL",
    experience: "2nd Season",
    awards: "",
    status: "Active",
    wins: 0,
    losses: 0
  },
  {
    name: "Bobby Floyd",
    position: "G",
    htwt: "5'10, 180lbs",
    college: "North Carolina State",
    birthplace: "St. Petersburg, FL",
    experience: "4th Season",
    awards: "Defensive Player of the Year 2022",
    status: "Active",
    wins: 0,
    losses: 0
  },
  {
    name: "Brandon Wright",
    position: "F",
    htwt: "6'4, 200lbs",
    college: "Lynn University",
    birthplace: "Boca Raton, FL",
    experience: "4th Season",
    awards: "All-Defensive Team 2021",
    status: "Active",
    wins: 0,
    losses: 0
  },
  {
    name: "Brian Gomez",
    position: "G",
    htwt: "6'1, 185lbs",
    college: "Nova Southeastern University",
    birthplace: "Hollywood, FL",
    experience: "6th Season",
    awards: "All-Star 2022",
    status: "Active",
    wins: 0,
    losses: 0
  },
  {
    name: "Dane Dill",
    position: "F",
    htwt: "6'4, 205lbs",
    college: "Stetson University",
    birthplace: "Daytona Beach, FL",
    experience: "4th Season",
    awards: "Defensive Player of the Year 2023",
    status: "Active",
    wins: 0,
    losses: 0
  },
  {
    name: "Dane Espegard",
    position: "G",
    htwt: "6'2, 190lbs",
    college: "University of Tampa",
    birthplace: "Sarasota, FL",
    experience: "6th Season",
    awards: "All-Defensive Team 2023",
    status: "Active",
    wins: 0,
    losses: 0
  },
  {
    name: "Derek Kissos",
    position: "G",
    htwt: "6'1, 180lbs",
    college: "Florida Gulf Coast University",
    birthplace: "Naples, FL",
    experience: "2nd Season",
    awards: "",
    status: "Active",
    wins: 0,
    losses: 0
  },
  {
    name: "Joey Grasso",
    position: "G",
    htwt: "6'2, 190lbs",
    college: "University of Central Florida",
    birthplace: "Jacksonville, FL",
    experience: "4th Season",
    awards: "Sixth Man of the Year 2023",
    status: "Active",
    wins: 0,
    losses: 0
  },
  {
    name: "Jordan Bowditch",
    position: "F",
    htwt: "6'3, 195lbs",
    college: "University of North Florida",
    birthplace: "Gainesville, FL",
    experience: "5th Season",
    awards: "All-Star 2022",
    status: "Active",
    wins: 0,
    losses: 0
  },
  {
    name: "KC Crowder",
    position: "G",
    htwt: "6'0, 175lbs",
    college: "Rollins College",
    birthplace: "Winter Park, FL",
    experience: "5th Season",
    awards: "All-Star 2021",
    status: "Active",
    wins: 0,
    losses: 0
  },
  {
    name: "Oscar Moncada",
    position: "G",
    htwt: "6'0, 180lbs",
    college: "Florida International University",
    birthplace: "Tampa, FL",
    experience: "3rd Season",
    awards: "Rookie of the Year 2022",
    status: "Active",
    wins: 0,
    losses: 0
  },
  {
    name: "Scott Ely",
    position: "F",
    htwt: "6'4, 200lbs",
    college: "University of South Florida",
    birthplace: "Fort Lauderdale, FL",
    experience: "7th Season",
    awards: "All-Defensive Team 2022",
    status: "Active",
    wins: 0,
    losses: 0
  },
  {
    name: "Shaun Morton",
    position: "G",
    htwt: "6'0, 185lbs",
    college: "Florida Atlantic University",
    birthplace: "West Palm Beach, FL",
    experience: "3rd Season",
    awards: "Most Improved Player 2023",
    status: "Active",
    wins: 0,
    losses: 0
  }
];

async function resetPlayers() {
  try {
    console.log('🔍 Fetching all current players...');
    
    // Get all current players
    const querySnapshot = await getDocs(collection(db, 'players'));
    const currentPlayers = [];
    
    querySnapshot.forEach((doc) => {
      currentPlayers.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`📊 Current players found: ${currentPlayers.length}`);
    
    // Delete all current players one by one
    console.log('🗑️ Deleting all current players...');
    for (const player of currentPlayers) {
      await deleteDoc(doc(db, 'players', player.id));
    }
    console.log('✅ All current players deleted');
    
    // Add the 15 unique players one by one
    console.log('➕ Adding 15 unique players with 0-0 records...');
    for (const playerData of uniquePlayers) {
      await addDoc(collection(db, 'players'), playerData);
    }
    console.log('✅ 15 unique players added');
    
    // Verify the result
    console.log('🔍 Verifying final result...');
    const finalSnapshot = await getDocs(collection(db, 'players'));
    const finalPlayers = [];
    
    finalSnapshot.forEach((doc) => {
      finalPlayers.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`📊 Final player count: ${finalPlayers.length}`);
    console.log('📋 Final players with 0-0 records:');
    finalPlayers
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((player, index) => {
        console.log(`${index + 1}. ${player.name} (${player.position}) - ${player.wins}-${player.losses} - ${player.college}`);
      });
    
    console.log('🎉 Player reset complete! All players now have 0-0 records.');
    
  } catch (error) {
    console.error('❌ Error resetting players:', error);
  }
}

resetPlayers();
