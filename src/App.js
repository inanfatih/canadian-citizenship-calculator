import React from 'react';

import './App.css';
import './style/main.css';
import Navbar from './components/Navbar';

import Home from './pages/Home';

import {
  Switch,
  Route,
  Redirect,
  BrowserRouter as Router,
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path='/' component={Home} />
        <Redirect to='/' />
      </Switch>
    </Router>
  );
}

export default App;
