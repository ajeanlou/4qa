import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { isAuthorizedUser } from '../utils/userRoles';

const AnalyticsDashboard = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [analytics, setAnalytics] = useState({
    sessionDuration: 0,
    pageViews: 0,
    actions: 0,
    engagementScore: 0
  });

  useEffect(() => {
    // Only show analytics for authorized users
    if (!currentUser || !isAuthorizedUser(currentUser.email)) {
      setAnalytics({
        sessionDuration: 0,
        pageViews: 0,
        actions: 0,
        engagementScore: 0
      });
      return;
    }

    // In a real app, you'd fetch this from your analytics service
    // For now, we'll simulate some data for authorized users only
    const mockAnalytics = {
      sessionDuration: Math.floor(Math.random() * 3600) + 300, // 5 minutes to 1 hour
      pageViews: Math.floor(Math.random() * 20) + 5,
      actions: Math.floor(Math.random() * 50) + 10,
      engagementScore: Math.floor(Math.random() * 100) + 50
    };
    setAnalytics(mockAnalytics);
  }, [currentUser]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getEngagementLevel = (score) => {
    if (score >= 80) return { level: 'High', color: 'text-green-400' };
    if (score >= 60) return { level: 'Medium', color: 'text-yellow-400' };
    return { level: 'Low', color: 'text-red-400' };
  };

  const engagement = getEngagementLevel(analytics.engagementScore);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-2">User Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">User:</span>
                <p className="text-white">{currentUser?.displayName || currentUser?.email}</p>
              </div>
              <div>
                <span className="text-gray-400">Member since:</span>
                <p className="text-white">
                  {currentUser?.metadata?.creationTime 
                    ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                    : 'Unknown'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Analytics Access Notice */}
          {!isAuthorizedUser(currentUser?.email) && (
            <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h4 className="text-lg font-semibold text-yellow-200">Analytics Restricted</h4>
              </div>
              <p className="text-yellow-200 text-sm">
                Analytics data is only available to authorized users (Amani and Bobby). 
                Contact an administrator to request analytics access.
              </p>
            </div>
          )}

          {/* Analytics Cards - Only for authorized users */}
          {isAuthorizedUser(currentUser?.email) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Session Duration */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-white">Session Duration</h4>
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-blue-400">
                {formatDuration(analytics.sessionDuration)}
              </p>
              <p className="text-sm text-gray-400 mt-1">Time spent in app</p>
            </div>

            {/* Page Views */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-white">Page Views</h4>
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-green-400">
                {analytics.pageViews}
              </p>
              <p className="text-sm text-gray-400 mt-1">Pages visited</p>
            </div>

            {/* Actions */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-white">Actions</h4>
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-yellow-400">
                {analytics.actions}
              </p>
              <p className="text-sm text-gray-400 mt-1">User interactions</p>
            </div>

            {/* Engagement Score */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-white">Engagement</h4>
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className={`text-3xl font-bold ${engagement.color}`}>
                {analytics.engagementScore}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {engagement.level} engagement
              </p>
            </div>
          </div>
          )}

          {/* Engagement Insights - Only for authorized users */}
          {isAuthorizedUser(currentUser?.email) && (
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-white mb-3">Engagement Insights</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Average time per page:</span>
                <span className="text-white">
                  {analytics.pageViews > 0 
                    ? formatDuration(Math.floor(analytics.sessionDuration / analytics.pageViews))
                    : '0m 0s'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Actions per page view:</span>
                <span className="text-white">
                  {analytics.pageViews > 0 
                    ? (analytics.actions / analytics.pageViews).toFixed(1)
                    : '0'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Engagement level:</span>
                <span className={engagement.color}>
                  {engagement.level}
                </span>
              </div>
            </div>
          </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Close Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;
