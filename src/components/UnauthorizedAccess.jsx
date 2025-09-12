import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const UnauthorizedAccess = ({ onClose }) => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="text-center max-w-md w-full"
      >
        <div className="mb-8">
          <div className="w-20 h-20 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Access Restricted</h1>
          <p className="text-gray-400">Data Input Authorization Required</p>
        </div>
        
        <div className="bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Unauthorized Access</h2>
          <p className="text-gray-400 mb-6">
            You don't have permission to access the data input page. Only authorized users can modify player statistics to maintain data integrity.
          </p>
          
          {currentUser && (
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-400 mb-2">Current user:</p>
              <p className="text-white font-medium">{currentUser.email}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
            >
              Return to App
            </button>
            
            <p className="text-sm text-gray-500">
              Contact an administrator to request data input access
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UnauthorizedAccess;
