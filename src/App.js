import React, { useEffect } from 'react';
// import firebase from 'firebase/app';

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
import Footer from './components/Footer';
// import { firebaseConfig } from './firebase/firebase';

import ReactGA from 'react-ga';

function App() {
  ReactGA.initialize('G-QJFDYMW7M2');
  ReactGA.pageview(window.location.pathname + window.location.search);
  // useEffect(() => {
  //   firebase.initializeApp(firebaseConfig);
  //   firebase.analytics();
  // }, []);
  return (
    <Router>
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
