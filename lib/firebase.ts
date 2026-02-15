
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/**
 * Safely retrieves environment variables from process.env.
 * Returns an empty string as a fallback to prevent crashes in Firebase initialization.
 */
const getEnv = (key: string): string => {
  try {
    // Check if process and process.env exist before accessing
    if (typeof process !== 'undefined' && process.env) {
      return (process.env as any)[key] || '';
    }
    return '';
  } catch (error) {
    console.warn(`Error reading environment variable ${key}:`, error);
    return '';
  }
};

const firebaseConfig = {
  apiKey: getEnv('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: getEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('NEXT_PUBLIC_FIREBASE_APP_ID')
};

// Minimum required fields for Firebase to attempt initialization
const isConfigValid = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

let auth: any = null;
let db: any = null;

if (isConfigValid) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully with provided config.");
  } catch (error) {
    console.error("Firebase initialization failed despite valid-looking config:", error);
  }
} else {
  console.warn("Firebase configuration is incomplete (Missing API Key or Project ID). The app will operate in 'Offline/Mock' mode.");
}

export { auth, db };
