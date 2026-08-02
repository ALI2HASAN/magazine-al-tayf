import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD5R1Uxis6mThbJz7AecObdWkLeJs4",
  authDomain: "magazine-al-tayf.firebaseapp.com",
  projectId: "magazine-al-tayf",
  storageBucket: "magazine-al-tayf.firebasestorage.app",
  messagingSenderId: "49829463216",
  appId: "1:49829463216:web:e616c6d299043f478a024"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
