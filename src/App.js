  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import ChooseCategorie from './pages/chooseCategorie';
  import Quizz from './pages/quizz';
  import Accueil from './pages/Accueil';
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
          <Routes>
            <Route path='/' element={<Accueil />} />
            <Route path='/chooseCategorie' element={<ChooseCategorie />} />
            <Route path='/quizz' element={<Quizz />} />
          </Routes>
        </Router>
      </div>
    );
  }

  export default App;
