import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('Checking if this logs before ReactDOM.createRoot');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('Checking if this logs after ReactDOM.createRoot');
