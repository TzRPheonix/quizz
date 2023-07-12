import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/historique.css';
import arrowback from '../arrowback.jpg';

function QuizzHistory() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [quizzHistory, setQuizzHistory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const scoresPerPage = 5;
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/categories');
        const data = response.data;
        console.log('Categories:', data);
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchQuizzHistory = async () => {
      try {
        console.log('User ID:', userId);
        console.log('Selected Category:', selectedCategory);

        if (userId && selectedCategory) {
          const response = await axios.get(`http://localhost:8000/api/scores/${userId}`);
          const data = response.data;
          console.log('Quizz History:', data);

          let matchingScores = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i].user_id == userId && data[i].category_id == selectedCategory) {
              matchingScores.push(data[i]);
            }
          }
          console.log('MatchingScores : ', matchingScores);
          setQuizzHistory(matchingScores);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuizzHistory();
  }, [userId, selectedCategory]);

  // Calculate the index page
  const indexOfLastScore = currentPage * scoresPerPage;
  const indexOfFirstScore = indexOfLastScore - scoresPerPage;
  const currentScores = quizzHistory.slice(indexOfFirstScore, indexOfLastScore);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <a href="/chooseCategorie" className="arrowback-link">
        <img src={arrowback} alt="Arrow Back" className="arrowback-image" />
      </a>
      <h1>Quizz History</h1>
      <div className="history">
        <div>
          <label htmlFor="categorySelect">Choix de la catégorie:</label>
          <select id="categorySelect" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">Sélectionner une catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categorie}
              </option>
            ))}
          </select>
        </div>
        <ul>
          {currentScores.length > 0 ? (
            currentScores.map((quizz) => (
              <li key={quizz.id}>
                <p>Date: {quizz.score_date}</p>
                <p>Score: {quizz.score}</p>
              </li>
            ))
          ) : (
            <li>Pas de score trouvé</li>
          )}
        </ul>
        {quizzHistory.length > scoresPerPage && (
          <div className="pagination">
            {Array.from({ length: Math.ceil(quizzHistory.length / scoresPerPage) }, (_, index) => (
              <button key={index} onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizzHistory;
