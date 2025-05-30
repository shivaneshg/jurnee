import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCs6D0MgoDC1Ixz5g61-BwZxdcthnaM4vM",
  authDomain: "jurnee-e57e9.firebaseapp.com",
  projectId: "jurnee-e57e9",
  storageBucket: "jurnee-e57e9.firebasestorage.app",
  messagingSenderId: "590502718296",
  appId: "1:590502718296:web:0db7e2de4ddc09d7d1132d",
  measurementId: "G-EN1WK3NVT6",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
