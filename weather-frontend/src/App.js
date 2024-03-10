// src/App.js

import React from 'react';
import './App.css';
import Homescreen from './Screens/Homescreen';
import Login from './Screens/LoginPage';
import Signup from './Screens/SignupPage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

const App = () => {

  return (
    <>
    <Router>
      <div className="App">
      <Routes>
            <Route exact path="/" element={<Homescreen/>} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            
          </Routes>
      </div>
    </Router>

    </>
      
     
    
  );
};

export default App;
