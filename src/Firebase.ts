import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Initialize Cloud Firestore through Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDIB_TDku-kof_ni16-YWl9Jb6CZoTzwNA',
  authDomain: 'bsf-lesson-filler.firebaseapp.com',
  databaseURL: 'https://bsf-lesson-filler.firebaseio.com',
  projectId: 'bsf-lesson-filler',
  storageBucket: 'bsf-lesson-filler.appspot.com',
  messagingSenderId: '469474314174',
  appId: '1:469474314174:web:2fb7c3e3d8a7b52fe99bef',
  measurementId: 'G-E8CEK6EJJN',
};

export const app = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
