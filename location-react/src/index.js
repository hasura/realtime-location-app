import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Driver from './Driver/Driver';

// Use the client just as before
// import { BrowserRouter as Router, Route } from 'react-router-dom';

ReactDOM.render(
  <Driver />,
  document.getElementById('root'));
