// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Optional, if you're using Firestore

const firebaseConfig = {
  apiKey: "AIzaSyCiViMxutTAmToak9EOB8X8vFkbK3Dt048",
  authDomain: "businessidcards.firebaseapp.com",
  projectId: "businessidcards",
  storageBucket: "businessidcards.firebasestorage.app", // ✅ FIXED THIS
  messagingSenderId: "676818265738",
  appId: "1:676818265738:web:6bd4d4990247ae10b46f73"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
