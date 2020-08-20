import React, { useEffect } from 'react';
import './App.css';
import './style/main.css';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import * as firebase from 'firebase/app';
import 'firebase/analytics';
import ReactGA from 'react-ga';
import firebaseConfig from './firebase/firebase';

import {
  Switch,
  Route,
  Redirect,
  BrowserRouter as Router,
} from 'react-router-dom';

function App() {
  useEffect(() => {
    firebase.initializeApp(firebaseConfig);
    const analytics = firebase.analytics;
    analytics().setCurrentScreen(window.location.pathname);
    analytics().logEvent('screen_view');

    ReactGA.initialize('UA-64262005-2');
    ReactGA.pageview('/');
    //eslint-disable-next-line
  }, []);

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
