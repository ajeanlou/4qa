# Firebase Troubleshooting Guide

## Common Firebase Errors and Solutions

### 1. "Firebase App named '[DEFAULT]' already exists"
**Cause**: Firebase is being initialized multiple times
**Solution**: Ensure Firebase is only initialized once in your app

### 2. "Permission denied" Error
**Cause**: Firestore security rules are blocking access
**Solution**: 
1. Go to Firebase Console > Firestore Database > Rules
2. Update rules to allow read/write access:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /players/{document} {
      allow read, write: if true;  // For development only
    }
  }
}
```

### 3. "Network error" or "Service unavailable"
**Cause**: Internet connection issues or Firebase service problems
**Solution**: 
1. Check your internet connection
2. Verify Firebase service status at https://status.firebase.google.com/
3. Check if your Firebase project is active

### 4. "Collection not found"
**Cause**: The collection doesn't exist yet
**Solution**: This is normal - the collection will be created automatically when you add the first document

### 5. "Firestore database not initialized"
**Cause**: Database instance is not properly initialized
**Solution**: Check your firebase.js configuration

## Testing Your Firebase Setup

### Step 1: Test Connection
1. Open your app in the browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Look for Firebase connection messages
5. Use the "Test Connection" button in the app

### Step 2: Test Write Permissions
1. Use the "Test Write" button in the app
2. Check console for success/error messages
3. If it fails, check your Firestore security rules

### Step 3: Test Real-time Updates
1. Open the app in two browser tabs
2. Make changes in one tab
3. Verify changes appear in the other tab automatically

## Environment Variables Setup

Create a `.env` file in your project root with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Firebase Console Setup

### 1. Enable Firestore Database
1. Go to Firebase Console
2. Select your project
3. Click "Firestore Database"
4. Click "Create database"
5. Choose "Start in test mode"
6. Select a location close to your users

### 2. Configure Security Rules
1. Go to Firestore Database > Rules
2. Update rules for development:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 3. Get Your Configuration
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click the web icon (</>)
4. Register your app
5. Copy the configuration object

## Debugging Tips

### 1. Check Browser Console
- Look for Firebase error messages
- Check network tab for failed requests
- Verify environment variables are loaded

### 2. Use Firebase Test Functions
- Click "Test Connection" button
- Click "Test Write" button
- Click "Test Permissions" button
- Check console output for detailed error information

### 3. Verify Project Configuration
- Ensure project ID matches in Firebase Console
- Check that Firestore is enabled
- Verify security rules allow access

## Production Considerations

### Security Rules for Production
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /players/{document} {
      allow read: if true;  // Allow public read access
      allow write: if request.auth != null;  // Require authentication for writes
    }
  }
}
```

### Environment Variables
- Never commit `.env` files to version control
- Use different Firebase projects for development and production
- Set up proper environment variable management

## Getting Help

If you're still experiencing issues:

1. Check the Firebase Console for any project-level issues
2. Verify your Firebase project billing is set up (required for Firestore)
3. Check Firebase service status
4. Review Firebase documentation for your specific error codes
5. Test with a minimal Firebase setup to isolate the issue
