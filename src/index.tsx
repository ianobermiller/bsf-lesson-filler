import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {UserProvider} from './hooks/useCurrentUser';
import './index.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

serviceWorker.register();
