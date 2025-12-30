// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getMessaging, isSupported} from "firebase/messaging"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCf5kvG_tAWBG70CCmnDI-TlTQdBH6LqbU",
  authDomain: "merch-website.firebaseapp.com",
  projectId: "merch-website",
  storageBucket: "merch-website.firebasestorage.app",
  messagingSenderId: "941499087662",
  appId: "1:941499087662:web:311f758b32a08c47edd8bf",
  measurementId: "G-DZR7HTXFGG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const getFirebaseMessaging = async () => {
  if (typeof window === "undefined") return null;
  const supported = await isSupported();
  if (!supported) return null;
  return getMessaging(app);
};