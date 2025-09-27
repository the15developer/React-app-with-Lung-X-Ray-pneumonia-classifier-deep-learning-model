import React from "react";

const DetectionForm = ({ title, onSubmit, onFileChange, imageUrl, prediction }) => {
  return (
    <div className="detection-container">
      <h2>{title}</h2>
      <p>Belirtileri tespit etmek için göğüs röntgeni görüntüsünü yükleyin.</p>
      <div className="form-section">
        <form onSubmit={onSubmit} encType="multipart/form-data">
          <input type="file" accept="image/*" onChange={onFileChange} className="file-input" />
          <button type="submit" className="submit-button">
            SUBMIT
          </button>
        </form>
      </div>
      {prediction && <p className="prediction-text">{prediction}</p>}
      {imageUrl && (
        <div className="image-display">
          <img src={imageUrl} alt="Uploaded X-ray" className="image" />
        </div>
      )}
    </div>
  );
};

export default DetectionForm;
