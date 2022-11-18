import { Routes, Route, Navigate } from 'react-router';

import './App.css';
import Home from './components/Home/Home.jsx';
import Login from './components/Login/Login.jsx';
import Signup from './components/Signup/Signup.jsx';


function App() {
  return (
    <Routes>
      <Route element={ <Navigate to='/home' /> } path="/" />
      <Route element={ <Home /> } path="/home" />
      <Route element={ <Login /> } path="/login" />
      <Route element={ <Signup /> } path="/signup" />
    </Routes>
  );
}

export default App;
