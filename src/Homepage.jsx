import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Sravya Isukapatla",
    phone: "+91 98765 43210",
    email: "sravyaisukapatla@gmail.com",
    linkedin: "https://linkedin.com/in/sravya-isukapatla-07776329b",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* TOP NAV */}
      <div className="top-nav">
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        <div className="top-right">
          <div className="search-box">
            <input type="text" placeholder="Type / to search" />
          </div>

          <div className="icons">
            <span className="icon">👥</span>
          </div>

          <div className="avatar" onClick={() => setProfileOpen(!profileOpen)}>
            <img src="/avatar.png" alt="Profile" />
          </div>
        </div>
      </div>

      {/* Slide-out Menu */}
      {menuOpen && (
        <div className={`side-menu ${menuOpen ? "show" : ""}`}>
          <ul>
            <li>Career Matches</li>
            <li>Learning Hub</li>
            <li>Progress Tracker</li>
            <li>Copilot Mentor</li>
            <li>Career Explorer</li>
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

      {/* PROFILE DROPDOWN */}
      {profileOpen && (
        <div className="profile-dropdown">
          <h2>👤 Profile</h2>

          <div className="form-box">
            <label>Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.name}</span>
            )}
          </div>

          <div className="form-box">
            <label>Contact</label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.phone}</span>
            )}
          </div>

          <div className="form-box">
            <label>Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.email}</span>
            )}
          </div>

          <div className="form-box">
            <label>LinkedIn</label>
            {isEditing ? (
              <input
                type="url"
                name="linkedin"
                value={profile.linkedin}
                onChange={handleChange}
              />
            ) : (
              <span>{profile.linkedin}</span>
            )}
          </div>

          {!isEditing ? (
            <button className="edit-toggle" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          ) : (
            <button className="save-btn" onClick={handleSave}>
               Save
            </button>
          )}

       

          <button className="logout-btn">Logout</button>
        </div>
      )}

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
