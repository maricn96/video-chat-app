import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import Navbar from './components/navbar/Navbar';
import { ContextProvider } from './Context';

import './styles.css';

ReactDOM.render(
  <ContextProvider>
    <Navbar />
    {/* <App /> */}
  </ContextProvider>,
  document.getElementById('root'),
);