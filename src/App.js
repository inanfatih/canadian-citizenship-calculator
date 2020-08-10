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
import CountDown from './pages/CountDown';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/count' component={CountDown} />
        <Redirect to='/' />
      </Switch>
    </Router>
  );
}

export default App;
