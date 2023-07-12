import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChooseCategorie from './pages/chooseCategorie';
import Quizz from './pages/quizz';
import Accueil from './pages/Accueil';
import Login from './pages/login';
import Register from './pages/register';
import UserProfile from './components/UserProfile';
import Historique from './pages/historique';
import './css/global.css';

function App() {
  return (
    <div className="App">
      <ul className="background">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <Router>  
      <UserProfile/>
        <Routes>
          <Route path='/' element={<Accueil />} />
          <Route path='/chooseCategorie' element={<ChooseCategorie />} />
          <Route path='/quizz' element={<Quizz />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/historique' element={<Historique />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
