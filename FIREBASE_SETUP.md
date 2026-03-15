# Firebase setup for TAPSS Science Blitz sign-in

Follow these steps to enable Google sign-in and the leaderboard for the Science Blitz competition.

## 1. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com).
2. Click **Add project**, name it (e.g. "TAPSS Blitz"), and continue.
3. You can disable Google Analytics if you don't need it.

## 2. Enable Google sign-in

1. In the left sidebar, go to **Build** → **Authentication**.
2. Open the **Sign-in method** tab.
3. Click **Google** → **Enable**, set the support email, and **Save**.

## 3. Create a Firestore database

1. In the left sidebar, go to **Build** → **Firestore Database**.
2. Click **Create database**.
3. Choose **Start in test mode** for quick setup (or production and add rules in step 7).
4. Pick a location and **Enable**.

## 4. Register a web app and copy config

1. From **Project Overview** (home icon), click the **Web** icon (`</>`) to add an app.
2. Register the app (e.g. name it "TAPSS Blitz") and **Register app**.
3. Copy the `firebaseConfig` object (the one with `apiKey`, `authDomain`, `projectId`, etc.). You will paste this into the project in step 6.

## 5. Add authorized domains

1. Go to **Authentication** → **Settings** (gear icon) → **Authorized domains**.
2. Add **localhost** for local testing.
3. When you deploy, add your production domain (e.g. `your-site.github.io` or your custom domain).

## 6. Paste config into the project

**Option A – paste into firebase-config.js**

1. Open **firebase-config.js** in this project.
2. Replace the entire placeholder object with your copied config. It should include all six fields: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`.
3. Save the file. Sign-in will be available after you reload the site.

**Option B – keep keys out of git (optional)**

1. Copy **firebase-config.local.js.example** to **firebase-config.local.js** in the project root (`firebase-config.local.js` is in `.gitignore`).
2. Replace the placeholder values in `firebase-config.local.js` with your Firebase web app config (same six fields as in Option A).
3. Leave **firebase-config.js** with placeholders. The app loads the local file first; if it exists, that config is used and your keys are not committed.

## 7. (Optional) Firestore security rules for production

For production, replace test-mode rules with secure rules:

1. Go to **Firestore Database** → **Rules**.
2. Paste the rules from the comment at the top of **firebase-config.js** (the block under "Firestore rules (optional, for production)").
3. **Publish**.

Those rules allow: users to read/write only their own profile; anyone to read the leaderboard; only signed-in users to create/update their own leaderboard entry.
