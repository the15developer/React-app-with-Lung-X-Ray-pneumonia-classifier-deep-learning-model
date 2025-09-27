import React from "react";

const HeroSection = ({ handleScrollToCovid, handleScrollToPneumonia }) => {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">Akciğer Röntgeni Sınıflandırıcı</h1>
        <p className="hero-text">
          Akciğer Röntgeni Sınıflandırıcı'ya hoş geldiniz. Yapay zeka destekli sistemimiz, göğüs röntgeni görüntülerinden
          <strong> COVID-19</strong> ve <strong>Zatürre</strong> belirtilerini tespit etmeye yardımcı olur.
        </p>

        <div className="info-section">
          <div className="info-box">
            <h3>COVID-19</h3>
            <p>COVID-19, SARS-CoV-2 virüsünün neden olduğu bir solunum yolu hastalığıdır.</p>
          </div>
          <div className="info-box">
            <h3>Pneumonia</h3>
            <p>Zatürre, akciğerlerdeki hava keseciklerini iltihaplandıran bir enfeksiyondur.</p>
          </div>
        </div>

        <div id="button-container">
          <button className="upload-button" onClick={handleScrollToCovid}>
            COVID-19
          </button>
          <button className="upload-button" onClick={handleScrollToPneumonia}>
            Pneumonia
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
