import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, handleLoginLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <button className="nav-title" onClick={() => navigate("/")}>
        Lung X-Ray Classifier
      </button>
      <div>
        <button className="other-button" onClick={() => navigate("/covid")}>
          Covid-19
        </button>
        <button className="other-button" onClick={() => navigate("/pneumonia")}>
          Pneumonia
        </button>
        <button className="other-button" onClick={() => navigate("/dashboard")}>
          <FontAwesomeIcon icon={faUser} />
        </button>

        <button onClick={handleLoginLogout} className="login-button">
          {isLoggedIn ? "Logout" : "Login"}
        </button>

      </div>
    </nav>
  );
};

export default Navbar;
