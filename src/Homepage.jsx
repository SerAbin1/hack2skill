import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* TOP NAV */}
      <div className="top-nav">
        {/* Hamburger */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        {/* LOG IN / SIGN UP */}
        <div className="auth-buttons">
          
        </div>
      </div>

      {/* Slide-out Menu */}
      {menuOpen && (
        <div className="side-menu">
          <ul>
            <li>👤 My Profile</li>
            <li>Career Matches</li>
            <li>Learning Hub</li>
            <li> Progress Tracker</li>
            <li>Copilot Mentor</li>
            <li>Career Explorer</li>
            <li>⚙ Settings</li>
            <li className="signout"> Sign Out</li>
          </ul>
        </div>
      )}

      {/* LOGO / TITLE */}
      <div className="logo-box">
        <h1>
          {"CareerCompass".split("").map((char, i) => (
            <span key={i} style={{ color: "#c2aaff", fontWeight: "bold" }}>
              {char}
            </span>
          ))}
        </h1>
        <p>Your AI Career Companion</p>
      </div>

      {/* BUTTON GRID */}
      <div className="button-grid">
        <button className="menu-btn">Take Skill Quiz</button>
        <button className="menu-btn">Upload Resume</button>
        <button className="menu-btn">Explore Careers</button>
        <button className="menu-btn">Watch Intro Video</button>
      </div>

      {/* HERO SECTION */}
      <div className="hero-text">
        <h2>Welcome, Sravya</h2>
        <p>What career suits me if I love design?</p>
        <p>Suggested Careers: UX Designer, Product Designer Cocersza</p>
        <button className="btn-primary">Try Mock Interview</button>
      </div>
    </div>
  );
};

export default Homepage;
