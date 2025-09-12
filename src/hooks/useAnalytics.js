import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Custom hook for user engagement tracking
export const useAnalytics = () => {
  const { currentUser } = useAuth();
  const sessionStartTime = useRef(Date.now());
  const pageViewCount = useRef(0);
  const actionCount = useRef(0);

  // Track page views
  const trackPageView = (pageName) => {
    pageViewCount.current += 1;
    console.log(`📊 Page View: ${pageName} (Total: ${pageViewCount.current})`);
    
    // In a real app, you'd send this to your analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageName,
        page_location: window.location.href,
        user_id: currentUser?.uid
      });
    }
  };

  // Track user actions
  const trackAction = (actionName, category = 'user_interaction', value = null) => {
    actionCount.current += 1;
    console.log(`📊 Action: ${actionName} in ${category} (Total: ${actionCount.current})`);
    
    // In a real app, you'd send this to your analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', actionName, {
        event_category: category,
        event_label: value,
        value: value,
        user_id: currentUser?.uid
      });
    }
  };

  // Track session duration
  const trackSessionDuration = () => {
    const duration = Math.round((Date.now() - sessionStartTime.current) / 1000);
    console.log(`📊 Session Duration: ${duration} seconds`);
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'session_duration', {
        value: duration,
        user_id: currentUser?.uid
      });
    }
  };

  // Track user engagement metrics
  const trackEngagement = () => {
    const sessionDuration = Math.round((Date.now() - sessionStartTime.current) / 1000);
    const engagementScore = (pageViewCount.current * 10) + (actionCount.current * 5) + Math.min(sessionDuration / 60, 100);
    
    console.log(`📊 Engagement Score: ${engagementScore.toFixed(2)}`);
    console.log(`📊 Session Stats:`, {
      duration: `${sessionDuration}s`,
      pageViews: pageViewCount.current,
      actions: actionCount.current,
      userId: currentUser?.uid
    });
    
    return {
      sessionDuration,
      pageViews: pageViewCount.current,
      actions: actionCount.current,
      engagementScore: Math.round(engagementScore)
    };
  };

  // Track when user signs in/out
  useEffect(() => {
    if (currentUser) {
      trackAction('user_sign_in', 'authentication');
      console.log(`📊 User signed in: ${currentUser.email}`);
    } else {
      trackAction('user_sign_out', 'authentication');
      console.log('📊 User signed out');
    }
  }, [currentUser]);

  // Track session end when component unmounts
  useEffect(() => {
    return () => {
      trackSessionDuration();
    };
  }, []);

  return {
    trackPageView,
    trackAction,
    trackEngagement,
    trackSessionDuration
  };
};
