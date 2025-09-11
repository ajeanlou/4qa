import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { subscribeToPlayers, addPlayer, updatePlayer, deletePlayer, updatePlayerStats, testFirebaseConnection, testFirebaseWrite, getPlayers } from './firebase';
const Card = ({ children, className }) => (
  <div className={`shadow-lg ${className}`}>{children}</div>
);
const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
const Button = ({ children, onClick, className }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-lg font-bold ${className}`}>
    {children}
  </button>
);



const PLAYER_LIST = [
  "Amani Jean-Louis",
  "Bobby Floyd",
  "Adrian Thomas",
  "Oscar Moncada",
  "Joey Grasso",
  "Scott Ely",
  "Shaun Morton",
  "Jordan Bowditch",
  "Derek Kissos",
  "Dane Espegard",
  "Dane Dill",
  "KC Crowder",
  "Blake Schultz",
  "Brian Gomez",
  "Brandon Wright"
];

function calculateRankings(players) {
  const playersWithStats = players.map(p => {
    const totalGames = p.wins + p.losses;
    const winPct = totalGames > 0 ? p.wins / totalGames : 0;
    const weightedScore = (p.wins * 0.75) + (winPct * 100 * 0.25);
    return { ...p, winPct: (winPct * 100).toFixed(1), weightedScore };
  }).sort((a, b) => b.weightedScore - a.weightedScore);

  // Calculate Games Behind (GB) for each player
  if (playersWithStats.length > 0) {
    const leader = playersWithStats[0];
    const leaderWins = leader.wins;
    const leaderLosses = leader.losses;
    
    return playersWithStats.map((player, index) => {
      if (index === 0) {
        // Leader has no games behind
        return { ...player, gamesBehind: '--' };
      } else {
        // Calculate games behind: ((Leader Wins - Player Wins) + (Player Losses - Leader Losses)) / 2
        const gamesBehind = ((leaderWins - player.wins) + (player.losses - leaderLosses)) / 2;
        return { ...player, gamesBehind: gamesBehind.toFixed(1) };
      }
    });
  }
  
  return playersWithStats;
}

export default function App() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [view, setView] = useState("data");
  const [bioTab, setBioTab] = useState("profiles");
  const [formData, setFormData] = useState({
    name: "", wins: "", losses: "",
    htwt: "", college: "", birthplace: "",
    status: "", experience: "", position: "", awards: ""
  });
  const [sessionData, setSessionData] = useState({ name: "", wins: "", losses: "" });
  const [connectionStatus, setConnectionStatus] = useState("Unknown");
  const [connectionStable, setConnectionStable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [autoSaveStatus, setAutoSaveStatus] = useState({ saving: false, lastSaved: null, error: null, typing: false });
  const autoSaveTimeoutRef = useRef(null);
  const [toastType, setToastType] = useState("success");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [previousView, setPreviousView] = useState("bio");

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  useEffect(() => {
    console.log('🚀 App starting up - setting up Firebase connection...');
    setConnectionStatus("Connecting...");

    // Set a timeout to handle connection issues
    const connectionTimeout = setTimeout(() => {
      if (connectionStatus === "Connecting...") {
        console.warn('⚠️ Connection timeout - Firebase may be slow to respond');
        setConnectionStatus("Slow Connection");
      }
    }, 10000); // 10 second timeout

    // Subscribe to real-time updates from Firebase
    const unsubscribe = subscribeToPlayers((firebasePlayers) => {
      console.log('📡 Received players from Firebase:', firebasePlayers.length);
      console.log('📡 Players data:', firebasePlayers);
      
      // Clear the timeout since we got a response
      clearTimeout(connectionTimeout);
      
      // Update connection status based on successful data reception
      if (connectionStatus !== "Connected") {
        console.log('✅ Firebase connection established');
        setConnectionStatus("Connected");
        setConnectionStable(true);
        setIsLoading(false);
      }
      
      if (firebasePlayers.length === 0) {
        // If no players in Firebase, initialize with default players
        console.log('🔄 No players found, initializing all 15 default players...');
        initializeDefaultPlayers();
      } else if (firebasePlayers.length < 15) {
        // If we have some players but not all 15, add the missing ones
        console.log(`📊 Found ${firebasePlayers.length} players, but expected 15. Adding missing players...`);
        setPlayers(firebasePlayers);
        initializeDefaultPlayers();
      } else {
        // Load all players from Firebase
        console.log('📊 Loading all players from Firebase');
        console.log('📊 Setting players state with:', firebasePlayers.length, 'players');
        setPlayers(firebasePlayers);
        
        // Log each player for debugging
        firebasePlayers.forEach((player, index) => {
          console.log(`Player ${index + 1}:`, player.name, player.id);
        });
      }
    }, (error) => {
      // Handle real-time listener errors
      console.error('❌ Real-time listener error:', error);
      clearTimeout(connectionTimeout);
      
      // Provide more specific error messages
      if (error.code === 'permission-denied') {
        setConnectionStatus("Permission Denied");
        console.error('❌ Firebase permission denied - check your Firestore security rules');
      } else if (error.code === 'unavailable') {
        setConnectionStatus("Service Unavailable");
        console.error('❌ Firebase service unavailable - check your internet connection');
      } else if (error.message.includes('not initialized')) {
        setConnectionStatus("Not Initialized");
        console.error('❌ Firebase not properly initialized - check your configuration');
      } else {
        setConnectionStatus("Failed");
        console.error('❌ Firebase connection failed:', error.message);
      }
      setConnectionStable(false);
      setIsLoading(false);
    });

    return () => {
      console.log('🔄 Cleaning up Firebase listener');
      clearTimeout(connectionTimeout);
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const initializeDefaultPlayers = async () => {
    console.log('🔄 Starting to initialize default players...');
    
    // First, get current players to avoid duplicates
    const currentPlayers = await getPlayers();
    const existingNames = currentPlayers.map(p => p.name);
    console.log('📋 Current players in database:', existingNames);
    
    const defaultPlayers = [
      { name: "Amani Jean-Louis", wins: 12, losses: 8, htwt: "6'0, 185lbs", college: "University of Florida", birthplace: "Miami, FL", status: "Active", experience: "5th Season", position: "G", awards: "All-Star 2023" },
      { name: "Bobby Floyd", wins: 15, losses: 5, htwt: "5'10, 180lbs", college: "North Carolina State", birthplace: "St. Petersburg, FL", status: "Active", experience: "4th Season", position: "G", awards: "Defensive Player of the Year 2022" },
      { name: "Adrian Thomas", wins: 18, losses: 2, htwt: "6'3, 195lbs", college: "University of Miami", birthplace: "Orlando, FL", status: "Active", experience: "6th Season", position: "F", awards: "MVP 2021" },
      { name: "Oscar Moncada", wins: 8, losses: 12, htwt: "6'1, 175lbs", college: "Florida International University", birthplace: "Tampa, FL", status: "Active", experience: "3rd Season", position: "G", awards: "Rookie of the Year 2022" },
      { name: "Joey Grasso", wins: 10, losses: 10, htwt: "6'2, 190lbs", college: "University of Central Florida", birthplace: "Jacksonville, FL", status: "Active", experience: "4th Season", position: "G", awards: "Sixth Man of the Year 2023" },
      { name: "Scott Ely", wins: 14, losses: 6, htwt: "6'4, 200lbs", college: "University of South Florida", birthplace: "Fort Lauderdale, FL", status: "Active", experience: "7th Season", position: "F", awards: "All-Defensive Team 2022" },
      { name: "Shaun Morton", wins: 7, losses: 13, htwt: "6'0, 185lbs", college: "Florida Atlantic University", birthplace: "West Palm Beach, FL", status: "Active", experience: "3rd Season", position: "G", awards: "Most Improved Player 2023" },
      { name: "Jordan Bowditch", wins: 11, losses: 9, htwt: "6'3, 195lbs", college: "University of North Florida", birthplace: "Gainesville, FL", status: "Active", experience: "5th Season", position: "F", awards: "All-Star 2022" },
      { name: "Derek Kissos", wins: 5, losses: 15, htwt: "6'1, 180lbs", college: "Florida Gulf Coast University", birthplace: "Naples, FL", status: "Active", experience: "2nd Season", position: "G", awards: "" },
      { name: "Dane Espegard", wins: 13, losses: 7, htwt: "6'2, 190lbs", college: "University of Tampa", birthplace: "Sarasota, FL", status: "Active", experience: "6th Season", position: "G", awards: "All-Defensive Team 2023" },
      { name: "Dane Dill", wins: 16, losses: 4, htwt: "6'4, 205lbs", college: "Stetson University", birthplace: "Daytona Beach, FL", status: "Active", experience: "4th Season", position: "F", awards: "Defensive Player of the Year 2023" },
      { name: "KC Crowder", wins: 9, losses: 11, htwt: "6'0, 175lbs", college: "Rollins College", birthplace: "Winter Park, FL", status: "Active", experience: "5th Season", position: "G", awards: "All-Star 2021" },
      { name: "Blake Schultz", wins: 6, losses: 14, htwt: "6'3, 195lbs", college: "Eckerd College", birthplace: "Clearwater, FL", status: "Active", experience: "2nd Season", position: "F", awards: "" },
      { name: "Brian Gomez", wins: 12, losses: 8, htwt: "6'1, 185lbs", college: "Nova Southeastern University", birthplace: "Hollywood, FL", status: "Active", experience: "6th Season", position: "G", awards: "All-Star 2022" },
      { name: "Brandon Wright", wins: 14, losses: 6, htwt: "6'4, 200lbs", college: "Lynn University", birthplace: "Boca Raton, FL", status: "Active", experience: "4th Season", position: "F", awards: "All-Defensive Team 2021" }
    ];

    // Filter out players that already exist
    const playersToAdd = defaultPlayers.filter(player => !existingNames.includes(player.name));
    console.log(`📝 Found ${playersToAdd.length} players to add (${defaultPlayers.length - playersToAdd.length} already exist)`);
    
    if (playersToAdd.length === 0) {
      console.log('✅ All default players already exist in database');
      return;
    }
    
    try {
      for (let i = 0; i < playersToAdd.length; i++) {
        const player = playersToAdd[i];
        console.log(`➕ Adding player ${i + 1}/${playersToAdd.length}:`, player.name);
        await addPlayer(player);
      }
      console.log(`✅ Successfully added ${playersToAdd.length} new players`);
    } catch (error) {
      console.error('❌ Error initializing default players:', error);
    }
  };

  const addOrUpdatePlayer = async () => {
    try {
      console.log('🔄 Starting addOrUpdatePlayer operation...');
      console.log('Selected player:', selectedPlayer);
      console.log('Form data:', formData);
      
      // Convert string values to numbers for saving
      const playerData = {
        ...formData,
        wins: parseInt(formData.wins) || 0,
        losses: parseInt(formData.losses) || 0
      };

      let result;
      if (selectedPlayer) {
        console.log('📝 Updating existing player:', selectedPlayer.id);
        result = await updatePlayer(selectedPlayer.id, playerData);
        console.log('✅ Player update result:', result);
        
        // Show success message
        showToast(`✅ Player "${playerData.name}" has been successfully updated!`, "success");
        
        setSelectedPlayer(null);
        setView("bio");
      } else {
        console.log('➕ Adding new player');
        result = await addPlayer(playerData);
        console.log('✅ Player add result:', result);
        
        // Show success message
        showToast(`✅ Player "${playerData.name}" has been successfully added!`, "success");
      }
      
      console.log('🧹 Clearing form data');
      setFormData({ name: "", wins: "", losses: "", htwt: "", college: "", birthplace: "", status: "", experience: "", position: "", awards: "" });
      console.log('✅ addOrUpdatePlayer completed successfully');
      
    } catch (error) {
      console.error('❌ Error in addOrUpdatePlayer:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      showToast(`❌ Error saving player: ${error.message}`, "error");
    }
  };

  const updateSessionData = async () => {
    if (!sessionData.name) return;

    try {
      const player = players.find(p => p.name === sessionData.name);
      if (player) {
        console.log('🔄 Updating player stats for:', player.name);
        const wins = parseInt(sessionData.wins) || 0;
        const losses = parseInt(sessionData.losses) || 0;
        await updatePlayerStats(player.id, wins, losses);
        console.log('✅ Player stats updated successfully');
        
        // Show success message
        showToast(`✅ ${player.name}'s stats updated! New Record: ${wins}W - ${losses}L`, "success");
        
        setSessionData({ name: "", wins: "", losses: "" });
        // Stay on data page to see updated rankings
      } else {
        console.error('❌ Player not found:', sessionData.name);
        showToast('❌ Player not found. Please try again.', "error");
      }
    } catch (error) {
      console.error('❌ Error updating player stats:', error);
      showToast(`❌ Error updating player stats: ${error.message}`, "error");
    }
  };

  const handleDeletePlayer = async (playerId) => {
    try {
      await deletePlayer(playerId);
      setSelectedPlayer(null);
    } catch (error) {
      console.error('Error deleting player:', error);
      alert('Error deleting player. Please try again.');
    }
  };

  const startEditPlayer = (player) => {
    console.log('🔄 Starting to edit player:', player);
    setSelectedPlayer(player);
    // Convert wins/losses to strings for form input
    const formDataForEdit = {
      ...player,
      wins: player.wins ? player.wins.toString() : "",
      losses: player.losses ? player.losses.toString() : ""
    };
    setFormData(formDataForEdit);
    setView("edit");
    console.log('✅ Player edit mode activated with form data:', formDataForEdit);
  };

  const viewProfile = (player) => {
    setPreviousView(view); // Store current view before switching to profile
    setSelectedPlayer(player);
    setView("profile");
  };

  // Auto-save function with debouncing
  const autoSavePlayer = useCallback(async (playerId, playerData) => {
    if (!playerId || !playerData) return;
    
    try {
      setAutoSaveStatus({ saving: true, lastSaved: null, error: null, typing: false });
      
      // Convert string values to numbers for saving and only include changed fields
      const dataToSave = {
        name: playerData.name,
        position: playerData.position,
        htwt: playerData.htwt,
        college: playerData.college,
        birthplace: playerData.birthplace,
        status: playerData.status,
        experience: playerData.experience,
        awards: playerData.awards,
        wins: parseInt(playerData.wins) || 0,
        losses: parseInt(playerData.losses) || 0
      };
      
      await updatePlayer(playerId, dataToSave);
      
      setAutoSaveStatus({ 
        saving: false, 
        lastSaved: new Date().toLocaleTimeString(), 
        error: null,
        typing: false
      });
      
      console.log('✅ Auto-saved player data:', playerId);
      
      // Show success message and navigate back to profile view
      showToast(`✅ ${playerData.name}'s profile updated successfully!`, "success");
      
      // Navigate back to profile view after successful save
      setTimeout(() => {
        setView("profile");
        setAutoSaveStatus({ saving: false, lastSaved: null, error: null, typing: false });
      }, 1500); // Wait 1.5 seconds to show the "Saved" message
      
    } catch (error) {
      console.error('❌ Auto-save failed:', error);
      setAutoSaveStatus({ 
        saving: false, 
        lastSaved: null, 
        error: error.message,
        typing: false
      });
    }
  }, []);

  // Debounced auto-save trigger
  const triggerAutoSave = useCallback((playerId, playerData) => {
    if (!playerId || !playerData) return;
    
    // Show immediate feedback that changes are being tracked
    setAutoSaveStatus({ saving: false, lastSaved: null, error: null, typing: true });
    
    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    // Set new timeout for auto-save (300ms delay for faster response)
    autoSaveTimeoutRef.current = setTimeout(() => {
      autoSavePlayer(playerId, playerData);
    }, 300);
  }, [autoSavePlayer]);

  const rankedPlayers = calculateRankings(players);
  
  // Debug logging for players state
  console.log('🎯 Current players state:', players.length, 'players');

  // Cleanup auto-save timeout on unmount or view change
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [view]);
  console.log('🎯 Ranked players:', rankedPlayers.length, 'players');

  // Show loading screen while connecting to Firebase
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Connecting to Firebase...</h2>
          <p className="text-gray-400">Loading your 4QA Hoops data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 p-4 sm:p-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          toastType === "success" 
            ? "bg-green-600 text-white" 
            : "bg-red-600 text-white"
        }`}>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{toastMessage}</span>
            <button 
              onClick={() => setToastMessage("")}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {/* Connection Status */}
      <div className="text-center mb-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          connectionStatus === "Connected" ? "bg-green-900 text-green-300" : 
          connectionStatus === "Failed" ? "bg-red-900 text-red-300" : 
          connectionStatus === "Permission Denied" ? "bg-red-900 text-red-300" :
          connectionStatus === "Service Unavailable" ? "bg-red-900 text-red-300" :
          connectionStatus === "Not Initialized" ? "bg-red-900 text-red-300" :
          connectionStatus === "Testing..." ? "bg-blue-900 text-blue-300" :
          connectionStatus === "Connecting..." ? "bg-blue-900 text-blue-300" :
          connectionStatus === "Slow Connection" ? "bg-orange-900 text-orange-300" :
          "bg-yellow-900 text-yellow-300"
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            connectionStatus === "Connected" ? "bg-green-400" : 
            connectionStatus === "Failed" ? "bg-red-400" : 
            connectionStatus === "Permission Denied" ? "bg-red-400" :
            connectionStatus === "Service Unavailable" ? "bg-red-400" :
            connectionStatus === "Not Initialized" ? "bg-red-400" :
            connectionStatus === "Testing..." ? "bg-blue-400 animate-pulse" :
            connectionStatus === "Connecting..." ? "bg-blue-400 animate-pulse" :
            connectionStatus === "Slow Connection" ? "bg-orange-400 animate-pulse" :
            "bg-yellow-400"
          }`}></div>
          Firebase: {connectionStatus}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Players loaded: {players.length} | Ranked: {rankedPlayers.length}
        </div>
        {players.length < 15 && (
          <Button 
            onClick={async () => {
              try {
                console.log('🔄 Manually initializing all 15 players...');
                await initializeDefaultPlayers();
                alert('All 15 players have been added! Refresh the page to see them.');
              } catch (error) {
                console.error('❌ Failed to initialize players:', error);
                alert(`Failed to add players: ${error.message}`);
              }
            }}
            className="mt-2 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded"
          >
            Add All 15 Players
          </Button>
        )}
      </div>

      {/* Hamburger Menu */}
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="fixed top-4 right-4 z-50 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg shadow-lg"
        >
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <div className={`w-full h-0.5 bg-gray-300 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`w-full h-0.5 bg-gray-300 transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-full h-0.5 bg-gray-300 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </div>
        </button>
        
        {/* Menu Dropdown */}
        {isMenuOpen && (
          <div className="fixed top-16 right-4 z-40 bg-gray-800 rounded-lg shadow-lg border border-gray-700 min-w-32">
            <div className="py-2">
              <button
                onClick={() => { setView("data"); setIsMenuOpen(false); }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 ${view === "data" ? "bg-gray-700 text-blue-400" : "text-gray-300"}`}
              >
                Input
              </button>
              <button
                onClick={() => { setView("standings"); setIsMenuOpen(false); }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 ${view === "standings" ? "bg-gray-700 text-blue-400" : "text-gray-300"}`}
              >
                Standings
              </button>
              <button
                onClick={() => { setView("bio"); setIsMenuOpen(false); }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 ${view === "bio" ? "bg-gray-700 text-blue-400" : "text-gray-300"}`}
              >
                Bio
              </button>
            </div>
          </div>
        )}
      </div>


      {/* Bio Page */}
      {view === "bio" && (
        <>

          {/* Player Profiles */}
          {bioTab === "profiles" && (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 max-w-7xl">
              {players.map((player) => (
                <motion.div key={player.name} whileHover={{ scale: 1.02 }} className="relative">
                  {/* Edit Symbol */}
                  <button
                    onClick={() => startEditPlayer(player)}
                    className="absolute top-2 right-2 z-10 p-1 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition-colors rounded"
                    title="Edit player"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <Card className="bg-gray-900 text-gray-100 shadow-lg">
                    <CardContent className="p-3 sm:p-4">
                      <div className="text-center mb-3">
                        <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <span className="text-lg font-bold text-gray-300">
                            {player.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <button 
                          onClick={() => viewProfile(player)} 
                          className="text-lg font-bold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                        >
                          {player.name}
                        </button>
                        <p className="text-gray-400 text-xs">{player.position} • {player.status}</p>
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">HT/WT:</span>
                          <span>{player.htwt || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Birthplace:</span>
                          <span>{player.birthplace || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Experience:</span>
                          <span>{player.experience || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">College:</span>
                          <span>{player.college || 'N/A'}</span>
                        </div>
                      </div>
                      
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              </div>
            </div>
          )}

        </>
      )}

      {/* Player Profile */}
      {view === "profile" && selectedPlayer && (
        <>
          {/* Back Arrow */}
          <button
            onClick={() => setView(previousView)}
            className="fixed top-4 left-4 z-50 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg shadow-lg text-gray-300 hover:text-white transition-colors"
            title={`Back to ${previousView === "standings" ? "Standings" : "Bio"}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-4xl font-bold text-center mb-6 sm:mb-10 text-silver"
          >
            {(() => {
              // Get the most current player data from the players array
              const currentPlayer = players.find(p => p.id === selectedPlayer.id) || selectedPlayer;
              return currentPlayer.name;
            })()}'s Bio
          </motion.h1>

          <div className="max-w-xl mx-auto">
            <Card className="bg-gray-900 text-gray-100 shadow-lg">
              <CardContent className="p-4 sm:p-6 space-y-2">
                {(() => {
                  // Get the most current player data from the players array
                  const currentPlayer = players.find(p => p.id === selectedPlayer.id) || selectedPlayer;
                  return (
                    <div className="flex justify-center">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p><b>Position:</b> {currentPlayer.position}</p>
                          <p><b>HT/WT:</b> {currentPlayer.htwt}</p>
                          <p><b>Birthdate:</b> {currentPlayer.birthdate || 'N/A'}</p>
                          <p><b>Birthplace:</b> {currentPlayer.birthplace}</p>
                        </div>
                        <div className="space-y-2">
                          <p><b>Status:</b> {currentPlayer.status}</p>
                          <p><b>Experience:</b> {currentPlayer.experience}</p>
                          <p><b>College:</b> {currentPlayer.college}</p>
                          <p><b>Awards:</b> {currentPlayer.awards}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Edit Player Page */}
      {view === "edit" && selectedPlayer && (
        <>


          <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-gray-900 border border-gray-700 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input 
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" 
                  value={formData.name} 
                  onChange={e => {
                    const newFormData = { ...formData, name: e.target.value };
                    setFormData(newFormData);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                <select 
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" 
                  value={formData.position} 
                  onChange={e => {
                    const newFormData = { ...formData, position: e.target.value };
                    setFormData(newFormData);
                  }}
                >
                  <option value="G">Guard (G)</option>
                  <option value="F">Forward (F)</option>
                  <option value="C">Center (C)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Height/Weight</label>
                <input 
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" 
                  value={formData.htwt} 
                  onChange={e => {
                    const newFormData = { ...formData, htwt: e.target.value };
                    setFormData(newFormData);
                  }}
                  placeholder="e.g., 6'0, 185lbs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">College</label>
                <input 
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" 
                  value={formData.college} 
                  onChange={e => {
                    const newFormData = { ...formData, college: e.target.value };
                    setFormData(newFormData);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Birthplace</label>
                <input 
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" 
                  value={formData.birthplace} 
                  onChange={e => {
                    const newFormData = { ...formData, birthplace: e.target.value };
                    setFormData(newFormData);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select 
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" 
                  value={formData.status} 
                  onChange={e => {
                    const newFormData = { ...formData, status: e.target.value };
                    setFormData(newFormData);
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Injured">Injured</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Experience</label>
                <select 
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" 
                  value={formData.experience} 
                  onChange={e => {
                    const newFormData = { ...formData, experience: e.target.value };
                    setFormData(newFormData);
                  }}
                >
                  <option value="1st Season">1st Season</option>
                  <option value="2nd Season">2nd Season</option>
                  <option value="3rd Season">3rd Season</option>
                  <option value="4th Season">4th Season</option>
                  <option value="5th Season">5th Season</option>
                  <option value="6th Season">6th Season</option>
                  <option value="7th Season">7th Season</option>
                  <option value="8th Season">8th Season</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Awards</label>
                <input 
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" 
                  value={formData.awards} 
                  onChange={e => {
                    const newFormData = { ...formData, awards: e.target.value };
                    setFormData(newFormData);
                  }}
                  placeholder="e.g., All-Star 2023, MVP 2021"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Wins</label>
                <input 
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" 
                  type="number" 
                  value={formData.wins} 
                  onChange={e => {
                    const value = e.target.value;
                    const newFormData = { ...formData, wins: value === '' ? '' : parseInt(value) || 0 };
                    setFormData(newFormData);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Losses</label>
                <input 
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" 
                  type="number" 
                  value={formData.losses} 
                  onChange={e => {
                    const value = e.target.value;
                    const newFormData = { ...formData, losses: value === '' ? '' : parseInt(value) || 0 };
                    setFormData(newFormData);
                  }}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <Button onClick={() => {
                console.log('🔄 Save Changes button clicked!');
                console.log('Current selectedPlayer:', selectedPlayer);
                console.log('Current formData:', formData);
                addOrUpdatePlayer();
              }} className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg">
                Save Changes
              </Button>
              <Button onClick={() => { setSelectedPlayer(null); setView("bio"); }} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg">
                Cancel
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Data Input Page */}
      {view === "data" && (
        <>

          <div className="max-w-2xl mx-auto mt-16">
            <div className="p-4 sm:p-6 bg-gray-900 shadow-lg mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Select Player</label>
                  <select 
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" 
                    value={sessionData.name} 
                    onChange={e => {
                      const selectedPlayer = players.find(p => p.name === e.target.value);
                      setSessionData({ 
                        name: e.target.value, 
                        wins: selectedPlayer ? selectedPlayer.wins.toString() : "", 
                        losses: selectedPlayer ? selectedPlayer.losses.toString() : "" 
                      });
                    }}
                  >
                    <option value="">Choose a player...</option>
                    {players.map(player => (
                      <option key={player.name} value={player.name}>{player.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Wins</label>
                  <input 
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" 
                    type="number" 
                    min="0"
                    value={sessionData.wins} 
                    onChange={e => {
                      const value = e.target.value;
                      setSessionData({ ...sessionData, wins: value === '' ? '' : parseInt(value) || 0 });
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Losses</label>
                  <input 
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" 
                    type="number" 
                    min="0"
                    value={sessionData.losses} 
                    onChange={e => {
                      const value = e.target.value;
                      setSessionData({ ...sessionData, losses: value === '' ? '' : parseInt(value) || 0 });
                    }}
                  />
                </div>
              </div>
              
              {sessionData.name && (
                <div className="bg-gray-800 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Wins:</span>
                      <p className="text-green-400 font-semibold">{players.find(p => p.name === sessionData.name)?.wins || 0}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Losses:</span>
                      <p className="text-red-400 font-semibold">{players.find(p => p.name === sessionData.name)?.losses || 0}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Win %:</span>
                      <p className="text-blue-400 font-semibold">
                        {(parseInt(sessionData.wins) || 0) + (parseInt(sessionData.losses) || 0) > 0 
                          ? (((parseInt(sessionData.wins) || 0) / ((parseInt(sessionData.wins) || 0) + (parseInt(sessionData.losses) || 0))) * 100).toFixed(1) 
                          : 0}%
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-4">
                <Button 
                  onClick={updateSessionData} 
                  disabled={!sessionData.name}
                  className="flex-1 px-4 py-2 bg-blue-800 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded"
                >
                  Update Stats
                </Button>
                <Button 
                  onClick={() => setSessionData({ name: "", wins: 0, losses: 0 })} 
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg"
                >
                  Clear
                </Button>
              </div>
            </div>

          </div>
        </>
      )}

      {/* Standings Page */}
      {view === "standings" && (
        <>

          <div className="max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full bg-black rounded-lg">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Player</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-200">W</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-200">L</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-200">Win%</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-200">GB</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {calculateRankings(players).map((player, index) => (
                      <>
                        <tr key={player.name} className={index < 6 ? "bg-black hover:bg-gray-900" : "bg-black hover:bg-gray-900"}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-200">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-xs">#{index + 1}</span>
                              <button 
                                onClick={() => viewProfile(player)} 
                                className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
                              >
                                {player.name}
                              </button>
                              {index < 6 && <span className="text-yellow-400">★</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-gray-200">{player.wins}</td>
                          <td className="px-4 py-3 text-center text-sm text-gray-200">{player.losses}</td>
                          <td className="px-4 py-3 text-center text-sm text-gray-200">{player.winPct}%</td>
                          <td className="px-4 py-3 text-center text-sm text-gray-200">{player.gamesBehind}</td>
                        </tr>
                        {index === 5 && (
                          <tr>
                            <td colSpan="5" className="px-0 py-2">
                              <div className="border-t-2 border-dotted border-gray-700"></div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
