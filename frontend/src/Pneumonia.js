import './Pneumonia.css';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faUser, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


const Pneumonia = () => {

  const [filePneumonia, setFilePneumonia] = useState(null);
  const [imageURLPneumonia, setImageURLPneumonia] = useState(null);
  const [predictionPneumonia, setPredictionPneumonia] = useState('');

  
  const handleFileChangePneumonia = (e) => {
    const selectedFile = e.target.files[0];
    setFilePneumonia(selectedFile);
  
    if (selectedFile) {
      const objectURL = URL.createObjectURL(selectedFile);
      setImageURLPneumonia(objectURL);
    }
  };
  
  const handleSubmitPneumonia = async (e) => {
    e.preventDefault();

    if (!filePneumonia) {
      setPredictionPneumonia('No file selected');
      console.log('Submite basildi ama resim secilmedi !')
      return;
    }

    const formData = new FormData();
    formData.append('file', filePneumonia);
    console.log('Submite basildi, resim de secildi !')

    try {
      const response = await fetch('http://127.0.0.1:5000/predictP', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPredictionPneumonia(`Prediction: ${data.prediction}`);
        // const objectURL = URL.createObjectURL(file);
        // setImageURL(objectURL);
      } else {
        setPredictionPneumonia('Error: ' + response.statusText);
      }
    } catch (error) {
      setPredictionPneumonia('Error: Failed to connect to the server');
    }
  };

  return (

<div className="Pneumonia">
  <div className="Pneumonia-container">
    <br />
    <br />
    <br />
    <h1>Welcome to the Pneumonia Detection Page</h1>
    <p>Upload an X-ray image to check for Pneumonia.</p>
    <br />
    <br />
    <br />

    <div  id="pneumonia" className="detection-container pneumonia">
    <h2>Zatürre Tespiti</h2>
    <p>Zatürre belirtilerini tespit etmek için göğüs röntgeni görüntüsünü yükleyin.</p>

    <div className="form-section">
      <form onSubmit={handleSubmitPneumonia} encType="multipart/form-data">
        <input
          type="file"
          name="file"
          accept="image/*"
          onChange={handleFileChangePneumonia}
          className="file-input"
        />
        <button type="submit" className="submit-button">SUBMIT</button>
      </form>
    </div>
    {predictionPneumonia && <p className="prediction-text">{predictionPneumonia}</p>}

    {imageURLPneumonia && (
      <div className="image-display-p">
        <img src={imageURLPneumonia} alt="Uploaded X-ray" className="image" />
      </div>
    )}
    
    </div>

    <br />
    <br />
    <br />



  </div>
</div>


  );
};

export default Pneumonia;