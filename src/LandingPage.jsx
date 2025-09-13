import React, { useState } from "react";
import "./LandingPage.css";

const LandingPage = () => {
  const [theme, setTheme] = useState("dark");

  return (
    <div className={`landing-container ${theme}`}>
      {/* TOP NAVIGATION */}
      <div className="top-nav">
         <div className="top-right"></div>
        <button className="nav-btn">LOG IN</button>
        
        
      </div>

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
        <button className="menu-btn">AI Resume Builder</button>
        <button className="menu-btn">Features</button>
        <button className="menu-btn">Services</button>
        <button className="menu-btn">Resources</button>
      </div>

      {/* HERO TEXT */}
      <div className="hero-text">
        <h2>Your AI Career Compass</h2>
        <p>
          AI Resume Builder • Automated Job Tracking • Optimize your LinkedIn
          Profile • And Much More...
        </p>
        <button className="btn-primary">SIGN UP FOR FREE</button>
      </div>
    </div>
  );
};

export default LandingPage;
