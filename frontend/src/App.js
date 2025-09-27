//import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './Account.css';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard"; // Import Dashboard
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faUser, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Account from './Account'; // Import the account component
import Pneumonia from './Pneumonia'; // Import the account component
import Covid from './Covid'; // Import the account component
import Pneumonia_sec from './Pneumonia_sec'; // Import the account component
import Covid_sec from './Covid_sec'; // Import the account component

function App() {
  
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [model, setModel]=useState('');
  const navigate = useNavigate(); // Use the `useNavigate` hook for programmatic navigation


  // Check for token in local storage on app initialization
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
    }
  }, []);

  
  const handleLoginLogout = () => {
    if (isLoggedIn) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      setIsLoggedIn(false);
    } else {
      navigate("/login");
    }
  };



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


  const handleShowLogin = (e) => {
    e.preventDefault();
    //console.log('Logging in with:', username, password);
    // Add login API logic here
    // setIsLoggedIn(true);
    setShowCreateUserForm(false);
    setShowLoginForm(true); // Hide login form after successful login

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


{(location.pathname === "/" || location.pathname === "/covid" || location.pathname === "/pneumonia") &&  (
      <Navbar isLoggedIn={isLoggedIn} handleLoginLogout={handleLoginLogout} />
    )}

<Routes>

<Route
path="/"
element={

<div className="App-container">

<div className='image-div'>
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
  
</div>  
}

/>
   <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
   <Route path="/signup" element={<Signup />} />
   <Route path="/dashboard" element={<Dashboard />} />
   <Route path="/account" element={<Account />} />
   <Route path="/pneumonia" element={<Pneumonia />} />
   <Route path="/dashboard/pneumonia" element={<Pneumonia_sec />} />
   <Route path="/covid" element={<Covid />} />
   <Route path="/dashboard/covid" element={<Covid_sec />} />
  </Routes>

</div>
  );
}

export default App;