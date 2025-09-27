import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Login = ({ setIsLoggedIn }) => {
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  
  const handleLogin = async (e) => {
    e.preventDefault();

    if ( !username || !password) {
      alert('Please fill in all fields !!');
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
        const loggedInUserId=data.user_id;
        const loggedInUserRole=data.userrole;

        localStorage.setItem('user_id', loggedInUserId)
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', loggedInUsername);
        localStorage.setItem('userrole', loggedInUserRole)

        console.log('User logged in', data);
        alert('User logged in successfully!');
  
        // Clear form fields
        setUsername('');
        setPassword('');

        setIsLoggedIn(true);
        navigate("/dashboard");
  
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



  return (
    <Container>
      <LeftSide>
        <BulletPoints>
          <ul>
            <li>
              <span className="icon">
              <FontAwesomeIcon icon={faUser} />
              </span>
              <div className="item-content">
                <span className="title">Easy to use</span>
                <span className="description">
                  Get started quickly with minimal setup.
                </span>
              </div>
            </li>

            <li>
              <span className="icon">
              <FontAwesomeIcon icon={faUser} />
              </span>
              <div className="item-content">
                <span className="title">Fast and secure</span>
                <span className="description">
                  Enjoy fast speeds and secure data.
                </span>
              </div>
            </li>
            <li>
              <span className="icon">
              <FontAwesomeIcon icon={faUser} />
              </span>
              <div className="item-content">
                <span className="title">Reliable service</span>
                <span className="description">
                  Our service is always up and running.
                </span>
              </div>
            </li>
            <li>
              <span className="icon">
              <FontAwesomeIcon icon={faUser} />
              </span>
              <div className="item-content">
                <span className="title">24/7 support</span>
                <span className="description">
                  We're here to help you anytime.
                </span>
              </div>
            </li>
            
          </ul>
        </BulletPoints>
      </LeftSide>

      <RightSide>
        
        <LoginBox>
          <h2>Sign in</h2>
          {error && <ErrorText>{error}</ErrorText>}

          <form onSubmit={handleLogin}>
            <FormGroup>
                <Label htmlFor="username">Username</Label>
                <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                />
            </FormGroup>

            

            <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                />
            </FormGroup>

            <Button type="submit">Login</Button>
         </form>

          <p>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>

          <p>
            or
          </p>

          <p>
            Sign up with Google
          </p>


        </LoginBox>
      </RightSide>
    </Container>
  );

};

// Styled-components for layout
const Container = styled.div`
  display: flex;
  height: 100vh;
  background: radial-gradient(circle, #e0eaff, #ffffff);
  backdrop-filter: blur(20px);
`;

const LeftSide = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const BulletPoints = styled.div`
  color: black;
  font-size: 18px;
  list-style-type: none;
  padding-left: 20px;
  padding-top: 50px;
  margin-right:-400px;

  ul {
    padding-left: 0;
    list-style-type: none;
    
  }

  li {
    margin-bottom: 10px;
    display: flex;
    align-items: center; /* Ensures everything is aligned properly */
    margin-bottom: 15px;
    
  }
  .icon {
    font-size: 20px; /* Adjust icon size */
    margin-right: 15px; /* Space between icon and text */
    color: #333; /* Optional: Change icon color */
  }

  .item-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* Ensures text aligns to the left */
  }

  .title {
    font-weight: bold;
    font-size: 16px;
  }

  .description {
    font-size: 14px;
    color: #333;
  }
`;

const RightSide = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  
`;

const LoginBox = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  border:1px solid #ccc;
  width: 100%;
  max-width: 350px;
  max-height: 500px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  margin-left:-300px;
  align-items: flex-start;

  h2 {
    text-align: left; /* Ensures the title is aligned to the left */
    width: 100%;
    margin-bottom: 20px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 14px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: darkblue;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 20px;
  margin-top:20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  align-items: flex-start; /* Ensures left alignment */
  width: 100%;
`;

const Label = styled.label`
  font-size: 14px;
  color: #333; /* Darker text for better readability */
  text-align: left;
  width: 100%; /* Ensures it takes the full width to stay aligned */
`;

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`;


export default Login;
