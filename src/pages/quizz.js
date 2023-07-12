import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../css/quizzPage.css';
import arrowback from '../arrowback.jpg';

function QuizzPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  
  // Use effect for testing
  useEffect(() => {
    console.log("Score updated:", score);
  }, [score]);

  const [timer, setTimer] = useState(20);
  const [shuffledAnswerOptions, setShuffledAnswerOptions] = useState([]);
  const [quizzEnded, setQuizzEnded] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackClass, setFeedbackClass] = useState('');
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);
  const [stopQuizzBtnDisabled, setStopQuizzBtnDisabled] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedCategoryName = searchParams.get('id');
  const userId = localStorage.getItem('userId');
  let lastQuestionCorrect = "False";

  // Fetch questions based on selected category
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/questions');
        const data = response.data;
        const filteredQuestions = data.filter(
          (question) => question.categorie === selectedCategoryName
        );
        setQuestions(filteredQuestions);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestions();
  }, [selectedCategoryName]);

  // Update shuffled answer options when the current question index changes
  useEffect(() => {
    if (currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      const answerOptions = getAnswerOptions(currentQuestion);
      setShuffledAnswerOptions(answerOptions);
    }
  }, [currentQuestionIndex, questions]);

  // Handle selection of an answer
  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  // Move to the next question
  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setTimer(20);
  };

  // Get the current question object
  const getCurrentQuestion = () => questions[currentQuestionIndex];

  // Get shuffled answer options for a given question
  const getAnswerOptions = (question) => {
    const answerOptions = [];
    const correctAnswer = question.reponse1;
  
    answerOptions.push(correctAnswer);
  
    const remainingOptions = [];
    for (let i = 2; i <= 10; i++) {
      const answerOption = question[`reponse${i}`];
      if (answerOption) {
        remainingOptions.push(answerOption);
      }
    }
  
    // By changing the value you can add more answers
    const shuffledOptions = getRandomOptions(remainingOptions, 3);
  
    // Combine the two array
    const finalOptions = [correctAnswer, ...shuffledOptions];
  
    // We shuffle a last time
    return shuffleArray(finalOptions);
  };
  
  const getRandomOptions = (options, count) => {
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    return shuffledOptions.slice(0, count);
  };
  
  const shuffleArray = (array) => {
    // Knuth Shuffle (Allow to store and replace at the same time)
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  

// Update the score based on the selected answer
const updateScore = async () => {
  const currentQuestion = getCurrentQuestion();
  const isCorrectAnswer = selectedAnswer === currentQuestion.reponse1;
  if (isCorrectAnswer) {
    console.log("C'est bon !");
    setScore((prevScore) => {
      const updatedScore = prevScore + 1;
      return updatedScore;
    });
    setFeedback('Bonne réponse !');
    setFeedbackClass('good');
    if (currentQuestionIndex === questions.length - 1) {
      lastQuestionCorrect = "True"
      setQuizzEnded(true);
      handleStopQuizz()
    }
  } else {
    console.log("C'est faux !");
    setFeedback('Mauvaise réponse !');
    setFeedbackClass('bad');
    if (currentQuestionIndex === questions.length - 1) {
      lastQuestionCorrect = "False"
      setQuizzEnded(true);
      handleStopQuizz()
    }
  }
};

// Stop the quizz and show final score
const handleStopQuizz = async () => {
  setStopQuizzBtnDisabled(true);
  setNextBtnDisabled(true);

  if (userId) {
    const currentDate = new Date().toISOString().split('T')[0];
    const selectedCategoryId = localStorage.getItem('selectedCategoryId');
    let currentScore = score; 
    if(lastQuestionCorrect === "True"){
      currentScore += 1;
    }
    const scoreData = {
      user_id: userId,
      category_id: selectedCategoryId,
      score: currentScore,
      score_date: currentDate,
    };

    try {
      console.log('Sending score data:', scoreData);
      await axios.post('http://localhost:8000/api/scores', scoreData);
      console.log('Score data sent successfully!');
    } catch (error) {
      console.error('Error while sending score data:', error);
    }
  }

  setQuizzEnded(true);
  console.log('Quizz ended.');
};
  

  // Handle next question with the result
  const handleNextQuestionShowResult = () => {
    updateScore();
    setNextBtnDisabled(true);
    setTimeout(() => {
      handleNextQuestion();
      setFeedback('');
      setNextBtnDisabled(false);
    }, 2000);
  };

  // Timer countdown and move to the next question when timer reaches 0
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    if (timer === 0) {
      clearInterval(timerInterval);
      handleNextQuestion();
    }

    return () => clearInterval(timerInterval);
  }, [timer]);

  return (
    <div>
      <a href="/chooseCategorie" className="arrowback-link">
        <img src={arrowback} alt="Arrow Back" className="arrowback-image" />
      </a>
      <h1 className="page-title">Quizz {selectedCategoryName}</h1>
      <div className="container">
        {!quizzEnded && getCurrentQuestion() && (
          <>
            <p className="question-number">Question {currentQuestionIndex + 1}</p>
            <p className="question-text">{getCurrentQuestion().question}</p>
            <ul className="answer-options">
              {shuffledAnswerOptions.map((answerOption) => (
                <li
                  key={answerOption}
                  className={`answer-option ${selectedAnswer === answerOption ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelection(answerOption)}
                >
                  {answerOption}
                </li>
              ))}
            </ul>
            <p className="score">Score: {score}</p>
            <p className={`timer ${feedback ? feedbackClass : ''}`}>
              {feedback || `Temps restant: ${timer} secondes`}
            </p>
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                className="next-button"
                onClick={handleNextQuestionShowResult}
                disabled={!selectedAnswer || nextBtnDisabled}
              >
                Question suivante
              </button>
            ) : (
              <button
                className="next-button"
                onClick={updateScore}
                disabled={stopQuizzBtnDisabled}
              >
                Terminer le Quizz
              </button>
            )}
          </>
        )}
        {quizzEnded && (
          <>
            <p className={`score final`}>Score final: {score}/{questions.length}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default QuizzPage;
