import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBRQMOunw1kgmG2mBhNvLBwVVQMrMvvotQ",
  authDomain: "chat-app-ba26b.firebaseapp.com",
  projectId: "chat-app-ba26b",
  storageBucket: "chat-app-ba26b.appspot.com",
  messagingSenderId: "187231698828",
  appId: "1:187231698828:web:650a579e63eefd94e2a0a9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
