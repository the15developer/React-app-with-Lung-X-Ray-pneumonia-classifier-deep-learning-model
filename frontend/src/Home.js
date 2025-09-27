import React, { useState } from "react";

const Home = () => {
  // States for file uploads
  const [imageURLCovid, setImageURLCovid] = useState(null);
  const [imageURLPneumonia, setImageURLPneumonia] = useState(null);
  const [predictionCovid, setPredictionCovid] = useState("");
  const [predictionPneumonia, setPredictionPneumonia] = useState("");

  // States for login/signup
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleFileChangeCovid = (e) => {
    const file = e.target.files[0];
    if (file) setImageURLCovid(URL.createObjectURL(file));
  };

  const handleFileChangePneumonia = (e) => {
    const file = e.target.files[0];
    if (file) setImageURLPneumonia(URL.createObjectURL(file));
  };

  const handleSubmitCovid = (e) => {
    e.preventDefault();
    setPredictionCovid("Processing...");
    // Add API call logic here
  };

  const handleSubmitPneumonia = (e) => {
    e.preventDefault();
    setPredictionPneumonia("Processing...");
    // Add API call logic here
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in:", username);
    // Add login logic here
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    console.log("Creating user:", username, email);
    // Add signup logic here
  };

  const handleShowLogin = () => {
    setShowLoginForm(true);
    setShowCreateUserForm(false);
  };

  const handleShowCreateUser = () => {
    setShowCreateUserForm(true);
    setShowLoginForm(false);
  };

  const handleScrollToCovid = () => {
    document.getElementById("covid").scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToPneumonia = () => {
    document.getElementById("pneumonia").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="App-container">
      <div className="image-div"></div>

      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Akciğer Röntgeni Sınıflandırıcı</h1>
          <p className="hero-text">
            Akciğer Röntgeni Sınıflandırıcı'ya hoş geldiniz. Yapay zeka destekli sistemimiz, göğüs röntgeni görüntülerinden <strong>COVID-19</strong> ve <strong>Zatürre</strong> belirtilerini tespit etmeye yardımcı olur. 
            Sadece bir röntgen görüntüsü yükleyin, modellerimiz olası akciğer anormalliklerini analiz etsin.
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

      {/* Detection Section */}
      <div className="detection-section">
        {/* Pneumonia Detection */}
        <div id="pneumonia" className="detection-container pneumonia">
          <h2>Zatürre Tespiti</h2>
          <p>Zatürre belirtilerini tespit etmek için göğüs röntgeni görüntüsünü yükleyin.</p>
          <form onSubmit={handleSubmitPneumonia}>
            <input type="file" accept="image/*" onChange={handleFileChangePneumonia} className="file-input" />
            <button type="submit" className="submit-button">SUBMIT</button>
          </form>
          {predictionPneumonia && <p className="prediction-text">{predictionPneumonia}</p>}
          {imageURLPneumonia && <img src={imageURLPneumonia} alt="Uploaded X-ray" className="image" />}
        </div>

        {/* COVID-19 Detection */}
        <div id="covid" className="detection-container covid">
          <h2>COVID-19 Tespiti</h2>
          <p>COVID-19 belirtilerini tespit etmek için göğüs röntgeni görüntüsünü yükleyin.</p>
          <form onSubmit={handleSubmitCovid}>
            <input type="file" accept="image/*" onChange={handleFileChangeCovid} className="file-input" />
            <button type="submit" className="submit-button">SUBMIT</button>
          </form>
          {predictionCovid && <p className="prediction-text">{predictionCovid}</p>}
          {imageURLCovid && <img src={imageURLCovid} alt="Uploaded X-ray" className="image" />}
        </div>
      </div>

      {/* Login & Signup Forms */}
      {showLoginForm && (
        <div className="login-form-container">
          <form onSubmit={handleLogin} className="login-form">
            <h3>Login</h3>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit" className="login-submit-button">Login</button>
            <button type="button" className="create-user-button" onClick={handleShowCreateUser}>Sign Up</button>
          </form>
        </div>
      )}

      {showCreateUserForm && (
        <div className="create-user-form-container">
          <form onSubmit={handleCreateUser} className="create-user-form">
            <h3>Sign Up</h3>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit" className="create-user-submit-button">Sign up</button>
            <button type="button" className="login-user-button" onClick={handleShowLogin}>Login</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;
