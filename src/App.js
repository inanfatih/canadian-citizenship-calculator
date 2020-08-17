import React, { useEffect } from 'react';
import './App.css';
import './style/main.css';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import * as firebase from 'firebase/app';
import 'firebase/analytics';

import {
  Switch,
  Route,
  Redirect,
  BrowserRouter as Router,
} from 'react-router-dom';
import Footer from './components/Footer';
import firebaseConfig from './firebase/firebase';
import ReactGA from 'react-ga';
import updateTracking from './util/updateTracking';

function App() {
  useEffect(() => {
    firebase.initializeApp(firebaseConfig);
    const analytics = firebase.analytics;
    analytics().setCurrentScreen(window.location.pathname);
    analytics().logEvent('screen_view');
    //eslint-disable-next-line
  }, []);

  ReactGA.initialize('G-QJFDYMW7M2');
  ReactGA.pageview(window.location.pathname + window.location.search);
  return (
    <Router>
      <Route path='/' component={updateTracking} />

      <Navbar />
      <Switch>
        <Route exact path='/' component={Home} />
        <Redirect to='/' />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
