import { Routes, Route, Navigate } from 'react-router';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import React, { useCallback } from "react";

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Home from './components/Home/Home.jsx';
import Login from './components/Login/Login.jsx';
import Signup from './components/Signup/Signup.jsx';
import ContactUs from './components/ContactUs/ContactUs.jsx';
import NavigationMenu from './components/NavigationMenu/NavigationMenu.jsx';


function App() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);
  return (
    <div className='App'>
    <NavigationMenu />
    <Routes>
      <Route element={ <Navigate to='/home' /> } path='/' />
      <Route element={ <Home /> } path="/home" />
      <Route element={ <Login /> } path="/login" />
      <Route element={ <Signup /> } path="/signup" />
      <Route element={ <ContactUs /> } path="/contact-us" />
    </Routes>
    <Particles id="tsparticles" init={particlesInit} options={options} />
    </div>
  );
}

const options = {
  fullScreen: { enable: true },
  background: {
    color: "transparent"
  },
  particles: {
    number: {
      value: 70,
      density: {
        enable: true,
        area: 900
      },
    },
    opacity: 0.7,
    color: "#980000",
    shape: {
      type: "circle"
    },
    size: {
      value: { min: 2, max: 4 }
    },
    links: {
      enable: true,
      distance: 100,
      color: "#808080",
      width: 1
    },
    move: {
      enable: true,
      speed: 6,
      direction: "none",
      random: true,
      straight: false,
      outModes: "out"
    }
  }
};

export default App;
