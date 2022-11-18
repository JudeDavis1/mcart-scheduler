import { Routes, Route, Navigate } from 'react-router';

import './App.css';
import Home from './components/Home/Home';

function App() {
  return (
    <Routes>
      <Route element={ <Navigate to={Home} /> } path="/" />
      <Route element={ Home } path="/home" />
    </Routes>
  );
}

export default App;
