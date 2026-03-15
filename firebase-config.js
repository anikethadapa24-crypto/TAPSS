/**
 * Firebase configuration for TAPSS Science Blitz competition.
 *
 * Paste your web app config from Firebase Console (Project settings → Your apps) below.
 *
 * Setup:
 * 1. Create a project at https://console.firebase.google.com
 * 2. Enable Authentication > Sign-in method > Google
 * 3. Create a Firestore database (start in test mode or add rules below)
 * 4. Register a web app and paste your config below
 *
 * See FIREBASE_SETUP.md in the project root for step-by-step instructions.
 *
 * Firestore rules (optional, for production):
 *   rules_version = '2';
 *   service cloud.firestore {
 *     match /databases/{db}/documents {
 *       match /users/{userId} { allow read, write: if request.auth != null && request.auth.uid == userId; }
 *       match /leaderboard/{doc} { allow read: if true; allow create: if request.auth != null; allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid; }
 *     }
 *   }
 */
if (typeof window.TAPSS_FIREBASE_CONFIG === 'undefined') {
  window.TAPSS_FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
}
