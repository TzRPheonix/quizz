import React, { useState } from 'react';
import axios from 'axios';
import '../css/login.css';
import arrowback from '../arrowback.jpg';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/users');
  
      // Check if user exists
      const user = response.data.find((user) => {
        return user.email === email && user.password === password;
      });
  
      if (user) {
        // User exists
        console.log('Login successful:', user);
        alert('Connexion réussie');
  
        // Storing user ID in local storage
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userEmail', user.email);
  
        // Redirect to quizz page
        window.location.href = '/chooseCategorie';
      } else {
        // User does not exist
        console.log('User does not exist');
        alert('Mauvaise combinaison d\'email et de mot de passe');
      }
    } catch (error) {
      // Login failed, handle the error as needed
      console.error('Login failed:', error);
    }
  };
  
  return (
    <div>
      <a href="/" className="arrowback-link">
        <img src={arrowback} alt="Arrow Back" className="arrowback-image" />
      </a>
      <h1 className="page-title">Connexion</h1>
      <div className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
        />
        <button onClick={handleLogin} className="form-button">
          Connexion
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
