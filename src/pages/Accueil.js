import React from 'react';
import '../css/accueil.css';

function Accueil() {
  const userEmail = localStorage.getItem('userEmail');

  const handleContinue = () => {
    window.location.href = '/chooseCategorie';
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    window.location.reload();
  };

  if (userEmail) {
    return (
      <div>
        <h1 className="page-title">Quizz Quest</h1>
        <div className="accueil-button">
          <button onClick={handleContinue} className="visitor-button" type="button">
            Continuer
          </button>
          <div className="login-buttons">
            <button onClick={handleLogout}>Déconnexion</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Quizz Quest</h1>
      <div className="accueil-button">
        <button onClick={() => window.location.href = '/chooseCategorie'} className="visitor-button" type="button">
          Visiteur
        </button>
        <div className="login-buttons">
          <button onClick={() => window.location.href = '/login'}>Se connecter</button>
          <button onClick={() => window.location.href = '/register'}>S'enregistrer</button>
        </div>
      </div>
    </div>
  );
}

export default Accueil;
