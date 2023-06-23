import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/quizzPage.css';
import arrowback from '../arrowback.jpg';

function QuizzPage() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(20);
  const [shuffledAnswerOptions, setShuffledAnswerOptions] = useState([]);
  const [quizEnded, setQuizEnded] = useState(false);
  const [feedback, setFeedback] = useState('');

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedCategoryName = searchParams.get('id');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/questions');
        const data = await response.json();
        const filteredQuestions = data.filter(question => question.categorie === selectedCategoryName);
        setQuestions(filteredQuestions);
        console.log(filteredQuestions);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuestions();
  }, [selectedCategoryName]);

  useEffect(() => {
    if (currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      const answerOptions = getAnswerOptions(currentQuestion);
      setShuffledAnswerOptions(answerOptions);
    }
  }, [currentQuestionIndex, questions]);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
    console.log('Selected Answer:', answer);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setTimer(20);
    } else {
      handleStopQuiz();
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

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

    const shuffledOptions = remainingOptions.sort(() => Math.random() - 0.5).slice(0, 3);

    const finalOptions = [correctAnswer, ...shuffledOptions];

    const shuffledFinalOptions = shuffleArray(finalOptions);

    return shuffledFinalOptions;
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const updateScore = () => {
    if (!quizEnded) {
      const currentQuestion = questions[currentQuestionIndex];
      const isCorrectAnswer = selectedAnswer === currentQuestion.reponse1;
  
      if (isCorrectAnswer) {
        setScore(score + 1);
        setFeedback('Bonne réponse !');
      } else {
        setFeedback('Mauvaise réponse !');
      }
    }
  };

  const handleStopQuiz = () => {
    updateScore();
    setQuizEnded(true);
  };

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000);

    if (timer === 0) {
      clearInterval(timerInterval);
      handleNextQuestion();
    }

    return () => clearInterval(timerInterval);
  }, [timer]);

  const handleNextQuestionWithFeedback = () => {
    updateScore();
    setTimeout(() => {
      handleNextQuestion();
      setFeedback('');
    }, 2000);
  };

  return (
    <div>
                        <a href="/chooseCategorie" className="arrowback-link">
        <img src={arrowback} alt="Arrow Back" className="arrowback-image" />
      </a>
    <div className="container">
      <h1 className="page-title">Quizz {selectedCategoryName}</h1>
      {!quizEnded && currentQuestion && (
        <>
          <p className="question-number">Question {currentQuestionIndex + 1}</p>
          <p className="question-text">{currentQuestion.question}</p>
          <ul className="answer-options">
            {shuffledAnswerOptions.map(answerOption => (
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
          <p className="timer">{feedback || `Temps restant: ${timer} secondes`}</p>
          {currentQuestionIndex < questions.length - 1 ? (
            <button
              className="next-button"
              onClick={handleNextQuestionWithFeedback}
              disabled={!selectedAnswer}
            >
              Question suivante
            </button>
          ) : (
            <button className="next-button" onClick={handleStopQuiz}>
              Terminer le Quiz
            </button>
          )}
        </>
      )}
{quizEnded && (
  <>
    <p className={`score final`}>Score final: {score}/{questions.length}</p>
  </>
)}
    </div>
    </div>
  );
}

export default QuizzPage;
