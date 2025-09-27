import './Account.css';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faUser, faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const Account = () => {
  return (

    <div className='Account'> 

    <div className='Account-container'>
      <br/><br/><br/>
      <h1>Welcome to the New Page!</h1>
      <p>This is the content of the new page.</p>
    </div>
</div>

  );
};

export default Account;