// Nuclear option: Complete collection reset
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

async function nuclearReset() {
  try {
    console.log('💥 NUCLEAR RESET: Starting complete collection wipe...');
    
    // Get all current players
    const querySnapshot = await getDocs(collection(db, 'players'));
    const currentPlayers = [];
    
    querySnapshot.forEach((doc) => {
      currentPlayers.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`📊 Found ${currentPlayers.length} players to delete`);
    
    // Delete ALL players in batches to avoid timeout
    console.log('🗑️ Deleting ALL players in batches...');
    const batchSize = 10;
    for (let i = 0; i < currentPlayers.length; i += batchSize) {
      const batch = currentPlayers.slice(i, i + batchSize);
      console.log(`   Deleting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(currentPlayers.length/batchSize)}`);
      
      for (const player of batch) {
        await deleteDoc(doc(db, 'players', player.id));
      }
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('✅ All players deleted');
    
    // Wait a moment for deletions to propagate
    console.log('⏳ Waiting for deletions to propagate...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify collection is empty
    const emptySnapshot = await getDocs(collection(db, 'players'));
    console.log(`🔍 Collection verification: ${emptySnapshot.size} documents remaining`);
    
    // Add the 15 unique players
    console.log('➕ Adding 15 unique players with 0-0 records...');
    for (let i = 0; i < uniquePlayers.length; i++) {
      const playerData = uniquePlayers[i];
      await addDoc(collection(db, 'players'), playerData);
      console.log(`   Added ${i + 1}/15: ${playerData.name}`);
    }
    
    console.log('✅ All 15 players added');
    
    // Final verification
    console.log('🔍 Final verification...');
    const finalSnapshot = await getDocs(collection(db, 'players'));
    const finalPlayers = [];
    
    finalSnapshot.forEach((doc) => {
      finalPlayers.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`📊 Final player count: ${finalPlayers.length}`);
    
    if (finalPlayers.length === 15) {
      console.log('🎉 SUCCESS! Exactly 15 players with 0-0 records:');
      finalPlayers
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((player, index) => {
          console.log(`${index + 1}. ${player.name} (${player.position}) - ${player.wins}-${player.losses}`);
        });
    } else {
      console.log('❌ ERROR: Expected 15 players, got', finalPlayers.length);
    }
    
  } catch (error) {
    console.error('❌ Error during nuclear reset:', error);
  }
}

nuclearReset();
