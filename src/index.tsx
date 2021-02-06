import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {UserProvider} from './hooks/useCurrentUser';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

navigator?.serviceWorker.ready
  .then(registration => registration.unregister())
  .catch(error => console.error(error.message));
