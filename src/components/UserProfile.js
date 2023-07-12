import React, { useState } from 'react';
import profilImage from '../profil.png';
import '../css/userProfile.css';

function UserProfile() {
  const [expanded, setExpanded] = useState(false);
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');

  const handleClick = () => {
    setExpanded(!expanded);
  };

  // Only display it if the user is logged in
  if (!userId) {
    return null;
  }

  return (
    <div className={`user-profile ${expanded ? 'expanded' : ''}`} onClick={handleClick}>
      <img src={profilImage} alt="Profile" className="profile-image" />
      {expanded && (
        <div className="profile-info">
          <p className="email">{userEmail}</p>
          <p className="password">Mot de passe: ********</p>
          <button className="history-button" onClick={() => window.location.href = '/historique'}>
            Historique
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
