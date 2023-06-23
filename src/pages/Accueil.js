import React from 'react';
import '../css/accueil.css';

function Accueil() {
  return (
    <div>
      <h1 className="page-title">Quizz App</h1>
      <div className="accueil-button">
        <button onClick={() => window.location.href='/chooseCategorie'} className="visitor-button" type="button">Visiteur</button>
        <div className="login-buttons">
          <button>Se connecter</button>
          <button>S'enregistrer</button>
        </div>
      </div>
    </div>
  );
}

export default Accueil;
