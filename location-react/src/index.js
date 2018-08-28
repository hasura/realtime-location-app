import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Driver from './Driver';
import registerServiceWorker from './registerServiceWorker';
// Use the client just as before

import { BrowserRouter as Router, Route } from 'react-router-dom';

const Main = () => (
  <Router>
    <div>
      <Route exact path="/" component={Driver} />
    </div>
  </Router>
);
ReactDOM.render(
  <Main />,
  document.getElementById('root'));

registerServiceWorker();
