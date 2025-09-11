import React from "react";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-container">
      {/* TOP NAVIGATION */}
      <div className="top-nav">
        <button className="nav-btn">LOG IN</button>
      
      </div>

      {/* LOGO / TITLE */}
      <div className="logo-box">
        <h1>
          <span style={{ color: "#c2aaff", fontWeight: "bold" }}>C</span>
          <span style={{ color: "#c2aaff", fontWeight: "bold" }}>a</span>
          <span style={{ color: "#c2aaff", fontWeight: "bold" }}>r</span>
          <span style={{ color: "#c2aaff", fontWeight: "bold" }}>e</span>
          <span style={{ color: "#c2aaff", fontWeight: "bold" }}>e</span>
          <span style={{ color: "#c2aaff", fontWeight: "bold" }}>r</span>
          <span style={{ color: "#c2aaff", fontWeight: "bold" }}>C</span>
          <span style={{ color: "#c2aaff", fontWeight: "bold" }}>o</span>
          <span style={{ color: "#c2aaff", fontWeight: "bold" }}>m</span>
          <span style={{ color: "#c2aaff", fontWeight: "bold" }}>p</span>
          <span style={{ color: "#c2aaff", fontWeight: "bold" }}>a</span>
          <span style={{ color: "#c2aaff", fontWeight: "bold" }}>s</span>
          <span style={{ color: "#c2aaff", fontWeight: "bold" }}>s</span>
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
