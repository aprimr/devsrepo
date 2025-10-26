import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJq0rCZ6OGC3dAeDy3SuWBQ4GFsCJovgw",
  authDomain: "devs-repo.firebaseapp.com",
  projectId: "devs-repo",
  storageBucket: "devs-repo.firebasestorage.app",
  messagingSenderId: "1076189405287",
  appId: "1:1076189405287:web:5a10f49d1dc58a023ef4c2",
  measurementId: "G-X7K9CYJ26N",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Add scopes
googleProvider.addScope("profile");
googleProvider.addScope("email");
githubProvider.addScope("user:email");

export default app;
