// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxhx6dPdcoqeXAKRH_4HmwTs1wjQPUsu8",
  authDomain: "hack2skill-2bb06.firebaseapp.com",
  projectId: "hack2skill-2bb06",
  storageBucket: "hack2skill-2bb06.firebasestorage.app",
  messagingSenderId: "993995554144",
  appId: "1:993995554144:web:918730a3a4496d0bba3205",
  measurementId: "G-H82KT0BN18"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);