import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
const Card = ({ children, className }) => (
  <div className={`rounded-xl shadow-lg ${className}`}>{children}</div>
);
const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
const Button = ({ children, onClick, className }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-lg font-bold ${className}`}>
    {children}
  </button>
);

const STORAGE_KEY = "4qa_players";

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
  "Brain Gomez",
  "Joe Richard",
  "Brandon Wright"
];

function calculateRankings(players) {
  return players.map(p => {
    const totalGames = p.wins + p.losses;
    const winPct = totalGames > 0 ? p.wins / totalGames : 0;
    const weightedScore = (p.wins * 0.75) + (winPct * 100 * 0.25);
    return { ...p, winPct: (winPct * 100).toFixed(1), weightedScore };
  }).sort((a, b) => b.weightedScore - a.weightedScore);
}

export default function App() {
  const [players, setPlayers] = useState([
    { name: "Bobby Floyd", wins: 0, losses: 0, htwt: "5’10, 180lbs", birthdate: "", college: "North Carolina State", birthplace: "St. Petersburg, FL", status: "Active", experience: "4th Season", position: "G", awards: "" }
  ]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [view, setView] = useState("statistics");
  const [formData, setFormData] = useState({
    name: "", wins: 0, losses: 0,
    htwt: "", birthdate: "", college: "", birthplace: "",
    status: "", experience: "", position: "", awards: ""
  });
  const [sessionData, setSessionData] = useState({ name: "", wins: 0, losses: 0 });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setPlayers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  }, [players]);

  const addOrUpdatePlayer = () => {
    if (selectedPlayer) {
      setPlayers(players.map(p => (p.name === selectedPlayer.name ? formData : p)));
      setSelectedPlayer(null);
    } else {
      setPlayers([...players, formData]);
    }
    setFormData({ name: "", wins: 0, losses: 0, htwt: "", birthdate: "", college: "", birthplace: "", status: "", experience: "", position: "", awards: "" });
  };

  const updateSessionData = () => {
    if (!sessionData.name) return;

    const updated = players.map(p => {
      if (p.name === sessionData.name) {
        return { ...p, wins: sessionData.wins, losses: sessionData.losses };
      }
      return p;
    });

    setPlayers(updated);
    setSessionData({ name: "", wins: 0, losses: 0 });
    setView("statistics");
  };

  const deletePlayer = (name) => {
    setPlayers(players.filter(p => p.name !== name));
    setSelectedPlayer(null);
  };

  const startEditPlayer = (player) => {
    setSelectedPlayer(player);
    setFormData(player);
    setView("statistics");
  };

  const viewProfile = (player) => {
    setSelectedPlayer(player);
    setView("profile");
  };

  const rankedPlayers = calculateRankings(players);

  return (
    <div className="min-h-screen bg-black text-gray-200 p-4 sm:p-6">
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Button onClick={() => setView("statistics")} className={view === "statistics" ? "bg-gray-600 w-full sm:w-auto" : "bg-gray-800 w-full sm:w-auto"}>Statistics</Button>
        <Button onClick={() => setView("bio")} className={view === "bio" ? "bg-gray-600 w-full sm:w-auto" : "bg-gray-800 w-full sm:w-auto"}>Bio</Button>
        <Button onClick={() => setView("data")} className={view === "data" ? "bg-gray-600 w-full sm:w-auto" : "bg-gray-800 w-full sm:w-auto"}>Data</Button>
      </div>

      {/* Statistics Page */}
      {view === "statistics" && (
        <>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-4xl font-bold text-center mb-6 sm:mb-10 text-silver"
          >
            Statistics
          </motion.h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {rankedPlayers.map((player, index) => (
              <motion.div key={player.name} whileHover={{ scale: 1.03 }}>
                <Card className="bg-gray-900 border border-gray-600 text-gray-100 rounded-xl shadow-lg">
                  <CardContent className="p-4 sm:p-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-300">{index + 1}</h2>
                    <p><b>Name:</b> {player.name}</p>
                    <p><b>Standing:</b> {index + 1}</p>
                    <p><b>Wins:</b> {player.wins}</p>
                    <p><b>Losses:</b> {player.losses}</p>
                    <p><b>Win%:</b> {player.winPct}%</p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                      <Button variant="secondary" onClick={() => startEditPlayer(player)} className="px-4 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg w-full sm:w-auto">Edit</Button>
                      <Button variant="destructive" onClick={() => deletePlayer(player.name)} className="px-4 py-1 bg-red-700 hover:bg-red-600 text-white rounded-lg w-full sm:w-auto">Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Bio Page */}
      {view === "bio" && (
        <>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-4xl font-bold text-center mb-6 sm:mb-10 text-silver"
          >
            Bio
          </motion.h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {players.map((player) => (
              <motion.div key={player.name} whileHover={{ scale: 1.03 }} onClick={() => viewProfile(player)} className="cursor-pointer">
                <Card className="bg-gray-900 border border-gray-600 text-gray-100 rounded-xl shadow-lg">
                  <CardContent className="p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-300">{player.name}</h2>
                    <p><b>HT/WT:</b> {player.htwt}</p>
                    <p><b>Birthdate:</b> {player.birthdate}</p>
                    <p><b>Status:</b> {player.status}</p>
                    <p><b>Birthplace:</b> {player.birthplace}</p>
                    <p><b>Experience:</b> {player.experience}</p>
                    <p><b>Position:</b> {player.position}</p>
                    <p><b>Awards:</b> {player.awards}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Player Profile */}
      {view === "profile" && selectedPlayer && (
        <>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-4xl font-bold text-center mb-6 sm:mb-10 text-silver"
          >
            {selectedPlayer.name}'s Profile
          </motion.h1>

          <div className="max-w-xl mx-auto">
            <Card className="bg-gray-900 border border-gray-600 text-gray-100 rounded-xl shadow-lg">
              <CardContent className="p-4 sm:p-6 space-y-2">
                <p><b>Name:</b> {selectedPlayer.name}</p>
                <p><b>HT/WT:</b> {selectedPlayer.htwt}</p>
                <p><b>Birthdate:</b> {selectedPlayer.birthdate}</p>
                <p><b>Status:</b> {selectedPlayer.status}</p>
                <p><b>Birthplace:</b> {selectedPlayer.birthplace}</p>
                <p><b>Experience:</b> {selectedPlayer.experience}</p>
                <p><b>Position:</b> {selectedPlayer.position}</p>
                <p><b>Awards:</b> {selectedPlayer.awards}</p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                  <Button variant="secondary" onClick={() => startEditPlayer(selectedPlayer)} className="px-4 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg w-full sm:w-auto">Edit</Button>
                  <Button variant="destructive" onClick={() => deletePlayer(selectedPlayer.name)} className="px-4 py-1 bg-red-700 hover:bg-red-600 text-white rounded-lg w-full sm:w-auto">Delete</Button>
                  <Button onClick={() => setView("bio")} className="px-4 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg w-full sm:w-auto">Back</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Data Input Page */}
      {view === "data" && (
        <>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-4xl font-bold text-center mb-6 sm:mb-10 text-silver"
          >
            Data Input
          </motion.h1>

          <div className="max-w-xl mx-auto p-4 sm:p-6 bg-gray-900 border border-gray-700 rounded-xl shadow-lg">
            <h2 className="text-xl sm:text-2xl mb-4 font-semibold text-gray-300">Update Player Stats</h2>
            <div className="grid grid-cols-1 gap-4">
              <select className="p-2 rounded bg-gray-800 text-white" value={sessionData.name} onChange={e => setSessionData({ ...sessionData, name: e.target.value })}>
                <option value="">Select Player</option>
                {PLAYER_LIST.map(player => (
                  <option key={player} value={player}>{player}</option>
                ))}
              </select>
              <input className="p-2 rounded bg-gray-800 text-white" type="number" placeholder="Wins" value={sessionData.wins} onChange={e => setSessionData({ ...sessionData, wins: parseInt(e.target.value) || 0 })}/>
              <input className="p-2 rounded bg-gray-800 text-white" type="number" placeholder="Losses" value={sessionData.losses} onChange={e => setSessionData({ ...sessionData, losses: parseInt(e.target.value) || 0 })}/>
            </div>
            <Button onClick={updateSessionData} className="mt-4 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg w-full sm:w-auto">Save</Button>
          </div>
        </>
      )}
    </div>
  );
}
