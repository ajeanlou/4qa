import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { addPlayer } from '../firebase';

const AddPlayerForm = ({ onClose, onPlayerAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    wins: 0,
    losses: 0,
    htwt: '',
    college: '',
    birthplace: '',
    status: 'Active',
    experience: '1st Season',
    position: 'G',
    awards: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'wins' || name === 'losses' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Player name is required');
      }

      // Check if player already exists (basic validation)
      if (formData.name.trim().length < 2) {
        throw new Error('Player name must be at least 2 characters');
      }

      await addPlayer(formData);
      
      // Reset form
      setFormData({
        name: '',
        wins: 0,
        losses: 0,
        htwt: '',
        college: '',
        birthplace: '',
        status: 'Active',
        experience: '1st Season',
        position: 'G',
        awards: ''
      });

      // Notify parent component
      if (onPlayerAdded) {
        onPlayerAdded();
      }

      // Close modal
      onClose();
    } catch (error) {
      console.error('Error adding player:', error);
      setError(error.message || 'Failed to add player. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-900">
          <h2 className="text-2xl font-bold text-white">Add New Player</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Player Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Enter player's full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Position
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              >
                <option value="G">Guard (G)</option>
                <option value="F">Forward (F)</option>
                <option value="C">Center (C)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Height/Weight
              </label>
              <input
                type="text"
                name="htwt"
                value={formData.htwt}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="e.g., 6'0, 185lbs"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                College
              </label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Enter college name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Birthplace
              </label>
              <input
                type="text"
                name="birthplace"
                value={formData.birthplace}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="e.g., Miami, FL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Injured">Injured</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Experience
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Awards
              </label>
              <input
                type="text"
                name="awards"
                value={formData.awards}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="e.g., All-Star 2023, MVP 2021"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Wins
              </label>
              <input
                type="number"
                name="wins"
                value={formData.wins}
                onChange={handleInputChange}
                min="0"
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Losses
              </label>
              <input
                type="number"
                name="losses"
                value={formData.losses}
                onChange={handleInputChange}
                min="0"
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Adding Player...
                </div>
              ) : (
                'Add Player'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddPlayerForm;
