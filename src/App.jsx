import { Routes, Route, Navigate } from 'react-router';

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Home from './components/Home/Home.jsx';
import Login from './components/Login/Login.jsx';
import Signup from './components/Signup/Signup.jsx';
import ContactUs from './components/ContactUs/ContactUs.jsx';
import NavigationMenu from './components/NavigationMenu/NavigationMenu.jsx';


function App() {
  return (
    <>
    <NavigationMenu />
    <Routes>
      <Route element={ <Navigate to='/home' /> } path='/' />
      <Route element={ <Home /> } path="/home" />
      <Route element={ <Login /> } path="/login" />
      <Route element={ <Signup /> } path="/signup" />
      <Route element={ <ContactUs /> } path="/contact-us" />
    </Routes>
    </>
  );
}

export default App;
