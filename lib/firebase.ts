
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/**
 * Safely retrieves environment variables. 
 * Mimics Python's os.environ.get(key, default)
 */
const safeGetEnv = (key: string, defaultValue: string = ''): string => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return (process.env as any)[key] || defaultValue;
    }
    return defaultValue;
  } catch {
    return defaultValue;
  }
};

const firebaseConfig = {
  apiKey: safeGetEnv('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: safeGetEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: safeGetEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: safeGetEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: safeGetEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: safeGetEnv('NEXT_PUBLIC_FIREBASE_APP_ID')
};

// Only initialize if we have the bare minimum
const hasRequiredConfig = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

let auth: any = null;
let db: any = null;

if (hasRequiredConfig) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase configuration missing. App is running in Local Mock Mode.");
}

export { auth, db };
