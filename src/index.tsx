import firebase from 'firebase';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

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
firebase.initializeApp(firebaseConfig);
