import React, { useState } from 'react';
import axios from 'axios';
import '../css/register.css';
import arrowback from '../arrowback.jpg';


function RegistrationPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistration = async () => {
    // Basic form validation checks
    if (!validateEmail(email)) {
      alert("Format d'email invalide");
      return;
    }

    if (!validatePassword(password)) {
      alert('Format de mot de passe invalide (8 charactère minimum et un chiffre)');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users', {
        name,
        email,
        password,
      });

      // Registration successful, handle the response as needed
      console.log('Registration successful:', response.data);
      alert('Inscription confirmée');

      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      // Registration failed, handle the error as needed
      console.error('Registration failed:', error);
    }
  };

  // Email validation function
  const validateEmail = (email) => {
    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const validatePassword = (password) => {
    // Minimum 8 characters and at least 1 number check
    const passwordRegex = /^(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  return (
    <div>
      <a href="/" className="arrowback-link">
        <img src={arrowback} alt="Arrow Back" className="arrowback-image" />
      </a>
      <h1 className="page-title">Inscription</h1>
      <div className="registration-form">
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
        />
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
        <button onClick={handleRegistration} className="form-button">
          Inscription
        </button>
      </div>
    </div>
  );
}

export default RegistrationPage;
