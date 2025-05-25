import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCuhZynz2___U8eWkikhGfPCHhUZGryxIo',
  authDomain: 'finalsmobdev-eb89f.firebaseapp.com',
  projectId: 'finalsmobdev-eb89f',
  storageBucket: 'finalsmobdev-eb89f.appspot.com',
  messagingSenderId: '634695404478',
  appId: '1:634695404478:web:234995985722ea7f4547ef',
  measurementId: 'G-PY97FHHY7T',
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app); // <- Add this

export { app, auth, db }; // <- Export db
