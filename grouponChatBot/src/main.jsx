import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter

// Wrap App component with Router
ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
