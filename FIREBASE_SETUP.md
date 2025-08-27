# Firebase Setup Guide

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "4qa-hoops")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database (choose the closest to your users)
5. Click "Done"

## Step 3: Get Your Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "4qa-hoops-web")
6. Copy the firebaseConfig object

## Step 4: Update Your Firebase Configuration

1. Open `src/firebase.js`
2. Replace the placeholder config with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Set Up Firestore Security Rules

1. In Firestore Database, go to the "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /players/{document} {
      allow read, write: if true;  // For development - change this for production
    }
  }
}
```

## Step 6: Test Your Connection

1. Start your development server: `npm run dev`
2. Open your app in the browser
3. Check the browser console for any Firebase connection errors
4. Try adding/updating player data to test the database connection

## Security Notes

⚠️ **Important**: The current security rules allow anyone to read and write to your database. For production:

1. Set up Firebase Authentication
2. Update security rules to only allow authenticated users
3. Consider implementing user roles and permissions

## Features Now Available

✅ **Real-time data synchronization** across all devices
✅ **Persistent data storage** in the cloud
✅ **Automatic backups** and data recovery
✅ **Multi-user support** (with proper authentication)
✅ **Offline support** (data syncs when connection is restored)

## Troubleshooting

- **"Firebase App named '[DEFAULT]' already exists"**: Make sure you're only initializing Firebase once
- **"Permission denied"**: Check your Firestore security rules
- **"Network error"**: Verify your Firebase configuration is correct
- **"Collection not found"**: The collection will be created automatically when you add the first document

## Next Steps

1. Set up Firebase Authentication for user management
2. Implement user roles (admin, data inputter, viewer)
3. Add data validation and error handling
4. Set up Firebase Hosting for deployment
