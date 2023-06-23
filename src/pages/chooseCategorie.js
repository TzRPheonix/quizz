import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';
import '../css/categorie.css';
import arrowLeft from '../arrowleft.png';
import arrowRight from '../arrowright.png';
import arrowDown from '../arrowdown.svg';
import arrowback from '../arrowback.jpg';

function ChooseCategorie() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/categories')
      .then(response => response.json())
      .then(data => {
        setCategories(data);
        setSelectedCategory(data[1]);
        setSelectedCategoryId(data[1].id);
      })
      .catch(error => console.error(error));
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    afterChange: index => {
      const nextCategoryIndex = (index + 1) % categories.length;
      setSelectedCategory(categories[nextCategoryIndex]);
      setSelectedCategoryId(categories[nextCategoryIndex].id);
    }
  };

  const handlePrevClick = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const handleNextClick = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const handleCategoryClick = (category, index) => {
    setSelectedCategory(category);
    setSelectedCategoryId(category.id);
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index-1);
    }
  };

  const handlePlayBtnClick = () => {
    navigate(`/quizz?id=${selectedCategory.categorie}`);
  };

  return (
    <div>
      <a href="/" className="arrowback-link">
        <img src={arrowback} alt="Arrow Back" className="arrowback-image" />
      </a>
      <h1 className="page-title">Categorie</h1>
      <br></br>
      <br></br>
      <div className="arrow-down-container">
        <img src={arrowDown} alt="Down Arrow" className="arrow-down" />
      </div>
      <div className="categories-container">
        <div className="left-arrow-container" onClick={handlePrevClick}>
          <img src={arrowLeft} alt="Previous" className="arrow" />
        </div>
        <Slider ref={sliderRef} {...sliderSettings}>
          {categories.map((category, index) => (
            <div className="categorie-button" key={category.id}>
              <button onClick={() => handleCategoryClick(category, index)}>
                {category.categorie}
              </button>
            </div>
          ))}
        </Slider>
        <div className="right-arrow-container" onClick={handleNextClick}>
          <img src={arrowRight} alt="Next" className="arrow" />
        </div>
        <div className="play-btn" onClick={handlePlayBtnClick}></div>
      </div>
      <div className="logo-container">
        {selectedCategory && (
          <img
            className="category-logo"
            src={`../logo/${selectedCategory.categorie}.png`}
            alt={selectedCategory.categorie}
          />
        )}
      </div>
    </div>
  );
}

export default ChooseCategorie;
