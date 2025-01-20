import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBNJLHepoRX4cM1rmlkgP2VPAnd4ngRdLk",
  authDomain: "task-manager-pro-48a21.firebaseapp.com",
  projectId: "task-manager-pro-48a21",
  storageBucket: "task-manager-pro-48a21.appspot.com",
  messagingSenderId: "996838818771",
  appId: "1:996838818771:web:e63e7fcab3c8e78fc02526",
  measurementId: "G-8CRYHQ30XW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

// Enable persistence
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });

export default app;