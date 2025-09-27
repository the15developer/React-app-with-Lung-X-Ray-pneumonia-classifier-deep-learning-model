//import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './Account.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faUser, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "Home";
import Account from './Account'; // Import the account component
import Pneumonia from './Pneumonia'; // Import the account component
import Covid from './Covid'; // Import the account component

function App() {
  
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [model, setModel]=useState('');
  const navigate = useNavigate(); // Use the `useNavigate` hook for programmatic navigation

  const [filePneumonia, setFilePneumonia] = useState(null);
  const [fileCovid, setFileCovid] = useState(null);
  const [imageURLPneumonia, setImageURLPneumonia] = useState(null);
  const [imageURLCovid, setImageURLCovid] = useState(null);
  const [predictionPneumonia, setPredictionPneumonia] = useState('');
  const [predictionCovid, setPredictionCovid] = useState('');


  // Check for token in local storage on app initialization
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
    }
  }, []);


  const handleNavigateToAccountPage = () => {
    navigate('/account'); // Navigate to the account page programmatically
  };

  const handleNavigateToMainPage = () => {
    navigate('/'); // Navigate to the account page programmatically
  };

  const handleNavigateToPneumoniaPage = () => {
    navigate('/pneumonia'); // Navigate to the account page programmatically
  };

  const handleScrollToPneumonia = () => {
    const targetElement = document.getElementById('pneumonia');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };  

  const handleScrollToCovid = () => {
    const targetElement = document.getElementById('covid');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };  



  const handleNavigateToCovidPage = () => {
    navigate('/covid'); // Navigate to the account page programmatically
  };



  const handleLoginLogout = () => {
    if (isLoggedIn) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      setIsLoggedIn(false);
    } else {
      setShowCreateUserForm(false);
      setShowLoginForm(true); // Show login form when user clicks login
    }
  };

  
  const handleFileChangePneumonia = (e) => {
    const selectedFile = e.target.files[0];
    setFilePneumonia(selectedFile);
  
    if (selectedFile) {
      const objectURL = URL.createObjectURL(selectedFile);
      setImageURLPneumonia(objectURL);
    }
  };
  
  const handleFileChangeCovid = (e) => {
    const selectedFile = e.target.files[0];
    setFileCovid(selectedFile);
  
    if (selectedFile) {
      const objectURL = URL.createObjectURL(selectedFile);
      setImageURLCovid(objectURL);
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

  const handleShowLogin = (e) => {
    e.preventDefault();
    //console.log('Logging in with:', username, password);
    // Add login API logic here
    // setIsLoggedIn(true);
    setShowCreateUserForm(false);
    setShowLoginForm(true); // Hide login form after successful login

  };



  const handleLogin = async (e) => {
    e.preventDefault();

    if ( !username || !password) {
      alert('Please fill in all fields');
      return;
    }
  
    const userData = {
      username,
      password,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        const data = await response.json();

        const token = data.token;
        const loggedInUsername=data.username;

        localStorage.setItem('authToken', token);
        localStorage.setItem('username', loggedInUsername);

        console.log('User logged in', data);
        alert('User logged in successfully!');
  
        // Clear form fields
        setUsername('');
        setPassword('');

        setIsLoggedIn(true);
  
        // Hide the login form
        setShowLoginForm(false);
      } else {
        const error = await response.json();
        console.error('Error logging in user:', error);
        alert('Error: ' + (error.message || 'Failed to login user.'));
      }
    } catch (error) {
      console.error('Error connecting to server:', error);
      alert('Error: Failed to connect to the server.');
    }

  };



  const handleShowCreateUser = (e) => {
    e.preventDefault();
    setShowLoginForm(false);
    setShowCreateUserForm(true);
    console.log('Redirect to create user form');
    // Add redirect logic or modal for creating a new user
  };



  const handleCreateUser = async (e) => {
    e.preventDefault();
  
    if (!email || !username || !password) {
      alert('Please fill in all fields');
      return;
    }
  
    const userData = {
      email,
      username,
      password,
    };
  
    try {
      const response = await fetch('http://127.0.0.1:5000/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('User created:', data);
        alert('User created successfully!');
  
        // Clear form fields
        setEmail('');
        setUsername('');
        setPassword('');
  
        // Hide the create-user form and switch back to login
        setShowCreateUserForm(false);
        setShowLoginForm(true);
      } else {
        const error = await response.json();
        console.error('Error creating user:', error);
        alert('Error: ' + (error.message || 'Failed to create user.'));
      }
    } catch (error) {
      console.error('Error connecting to server:', error);
      alert('Error: Failed to connect to the server.');
    }
  };
  


  return (
    <div className="App">

     <nav className="navbar">
        <button className="nav-title" onClick={handleNavigateToMainPage}>Lung X-Ray Classifier</button>
        <div>
        <button className="other-button" onClick={handleScrollToCovid}>
          Covid-19
        </button>
        <button className="other-button" onClick={handleScrollToPneumonia}>
          Pneumonia
        </button>
        <button className="other-button" onClick={handleNavigateToAccountPage}>
        <FontAwesomeIcon icon={faUser} />
        </button>
        <button onClick={handleLoginLogout} className="login-button">
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>
        </div>

      </nav>

<Routes>

<Route
path="/"
element={

<div className="App-container">

<div className='image-div'>
{/* <br/><br/><br/> */}
</div>


<div className='hero-container'>
  <div className="hero-content">
    <h1 className="hero-title">Akciğer Röntgeni Sınıflandırıcı</h1>
    <p className="hero-text">
      Akciğer Röntgeni Sınıflandırıcı'ya hoş geldiniz. Yapay zeka destekli sistemimiz, göğüs röntgeni görüntülerinden <strong>COVID-19</strong> ve <strong>Zatürre</strong> belirtilerini tespit etmeye yardımcı olur. 
      Sadece bir röntgen görüntüsü yükleyin, modellerimiz olası akciğer anormalliklerini analiz etsin.
    </p>

    
    
    <div className="info-section">
      <div className="info-box">
        <h3>COVID-19</h3>
        <p>
        COVID-19, SARS-CoV-2 virüsünün neden olduğu bir solunum yolu hastalığıdır.
        Etkilenen hastaların göğüs röntgenlerinde akciğerlerde buzlu cam opasiteleri ve bilateral infiltratlar görülebilir.
        </p>
      </div>
      
      <div className="info-box">
        <h3>Pneumonia</h3>
        <p>
        Zatürre, akciğerlerdeki hava keseciklerini iltihaplandıran bir enfeksiyondur.
        Röntgen görüntüleri genellikle akciğer konsolidasyonunu ve sıvı dolu hava boşluklarını ortaya çıkarır ve bu da hastalığın teşhisine yardımcı olur.
        </p>
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
  

<div className="detection-section">

  {/* Pneumonia Detection */}
  <div id="pneumonia" className="detection-container pneumonia">
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


  {/* COVID-19 Detection */}
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
</div>






<br /><br /><br />

<div>
  <br /><br /><br />
</div>




  {/* Login Form */}
  {showLoginForm && (
      <div className="login-form-container">
        <form onSubmit={handleLogin} className="login-form">
          <h3>Login</h3>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />

          <button type="submit" className="login-submit-button" onClick={handleLogin}>
            Login
          </button>

          <button type="button" className="create-user-button" onClick={handleShowCreateUser}>
            Sign Up
          </button>

        </form>
      </div>
    )}

  {/* Create User Form */}
  {showCreateUserForm && (
      <div className="create-user-form-container">
        <form onSubmit={handleCreateUser} className="create-user-form">
          <h3>Login</h3>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label>
            E-mail:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <br />

          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <br />

          <button type="submit" className="create-user-submit-button" onClick={handleCreateUser}>
            Sign up
          </button>

          <button
            type="button" className="login-user-button" onClick={handleShowLogin}>
            Login
          </button>

        </form>
      </div>
    )} 
    </div>  
}
/>
   <Route path="/account" element={<Account />} />
   <Route path="/pneumonia" element={<Pneumonia />} />
   <Route path="/covid" element={<Covid />} />
  </Routes>
{/* </Router> */}
</div>
  );
}

export default App;