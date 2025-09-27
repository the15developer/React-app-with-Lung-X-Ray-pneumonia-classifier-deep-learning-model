import './Covid.css';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faUser, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const Covid = () => {

  
  const [fileCovid, setFileCovid] = useState(null);
  const [imageURLCovid, setImageURLCovid] = useState(null);
  const [predictionCovid, setPredictionCovid] = useState('');

  const handleFileChangeCovid = (e) => {
    const selectedFile = e.target.files[0];
    setFileCovid(selectedFile);
  
    if (selectedFile) {
      const objectURL = URL.createObjectURL(selectedFile);
      setImageURLCovid(objectURL);
    }
  };

  
  const handleSubmitCovid = async (e) => {
    e.preventDefault();

    if (!fileCovid) {
      setPredictionCovid('No file selected');
      console.log('Submite basildi ama resim secilmedi !')
      return;
    }

    const formData = new FormData();
    formData.append('file', fileCovid);
    
    console.log('Submite basildi, resim de secildi !')

    try {
      const response = await fetch('http://127.0.0.1:5000/predictC', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPredictionCovid(`Prediction: ${data.prediction}`);
        // const objectURL = URL.createObjectURL(file);
        // setImageURL(objectURL);
      } else {
        setPredictionCovid('Error: ' + response.statusText);
      }
    } catch (error) {
      setPredictionCovid('Error: Failed to connect to the server');
    }
  };



  return (

    <div className='Covid'> 

    <div className='Covid-container'>
      <br/><br/><br/>
      <h1>Welcome to the New Page!</h1>
      <p>This is the content of the new page.</p>

      <br />
      <br />
      <br />


      <div id="covid" className="detection-container covid">

      <h2>COVID-19 Tespiti</h2>
      <p>COVID-19 belirtilerini tespit etmek için göğüs röntgeni görüntüsünü yükleyin.</p>

      <div className="form-section">
      <form onSubmit={handleSubmitCovid} encType="multipart/form-data">
        <input
          type="file"
          name="file"
          accept="image/*"
          onChange={handleFileChangeCovid}
          className="file-input"
        />
        <button type="submit" className="submit-button">SUBMIT</button>
      </form>
    </div>

    {predictionCovid && <p className="prediction-text">{predictionCovid}</p>}

    {imageURLCovid && (
      <div className="image-display-c">
        <img src={imageURLCovid} alt="Uploaded X-ray" className="image" />
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

export default Covid;