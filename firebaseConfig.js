// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLGDewFpT7-XGHxfF1IAi7YhUpfPB0Eq8",
  authDomain: "finalsmobdev-8240f.firebaseapp.com",
  projectId: "finalsmobdev-8240f",
  storageBucket: "finalsmobdev-8240f.firebasestorage.app",
  messagingSenderId: "825514504685",
  appId: "1:825514504685:web:c4d7e6de489ce67358b7e4",
  measurementId: "G-XPXEHEWVK1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Add persistence for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Firestore instance
export const db = getFirestore(app);
