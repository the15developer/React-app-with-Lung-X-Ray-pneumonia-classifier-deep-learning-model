return (
    <div className="App">
      <Router>
        <nav className="navbar">
          <h1 className="nav-title">Lung X-Ray Classifier</h1>
          <div>
            <button className="other-button" onClick={handleNavigateToNewPage}>
              Go to New Page
            </button>
            <button className="other-button">
              Covid-19
            </button>
            <button className="other-button">
              Pneumonia
            </button>
            <button className="other-button">
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
              <div className="App-header">
                <h2>Upload and Classify X-Ray Images</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <input
                    type="file"
                    id="fileInput"
                    name="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <button type="submit" className="submit-button">
                    SUBMIT
                  </button>
                </form>

                {prediction && <p>{prediction}</p>}

                {imageURL && (
                  <div className="image-display" style={{ width: '408px', height: '408px', border: '3px solid black' }}>
                    <img src={imageURL} alt="Uploaded X-ray" className="image" style={{ width: '100%', height: '100%' }} />
                  </div>
                )}

                {showLoginForm && (
                  <div className="login-form-container">
                    {/* Login Form */}
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

                {showCreateUserForm && (
                  <div className="create-user-form-container">
                    {/* Create User Form */}
                    <form onSubmit={handleCreateUser} className="create-user-form">
                      <h3>Sign Up</h3>
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
                      <button type="submit" className="create-user-submit-button" onClick={handleCreateUser}>
                        Sign Up
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
          <Route path="/newpage" element={<NewPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;




return (
    <div className="App">

    <div className="App-header">

     {/* Navbar */}


     <nav className="navbar">
        <h1 className="nav-title">Lung X-Ray Classifier</h1>
        <div>
        <button className="other-button">
          Covid-19
        </button>
        <button className="other-button">
          Pneumonia
        </button>
        <button className="other-button">
        <FontAwesomeIcon icon={faUser} />
        </button>
        <button onClick={handleLoginLogout} className="login-button">
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>
        </div>

      </nav>

      {/* <header className="App-header"> */}



      <h2>Upload and Classify X-Ray Images</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="file"
            id="fileInput"
            name="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button type="submit" className="submit-button">
            SUBMIT
            </button>
        </form>

        {prediction && <p>{prediction}</p>}

        

      

        {imageURL && (
          <div className="image-display" style={{ width: '408px', height: '408px', border: '3px solid black' }}>
            <img src={imageURL} alt="Uploaded X-ray" className="image" style={{ width: '100%', height: '100%' }} />
          </div>
        )}


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
  );
}

export default App;