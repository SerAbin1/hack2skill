import React from "react";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div>
      {/* NAVBAR */}
      <header className="navbar">
        <div className="logo">
          Career<span>Compass</span>
        </div>
        <nav className="nav-links">
          <a href="#">AI Resume Builder</a>
          <a href="#">Features</a>
          <a href="#">Services</a>
          <a href="#">Resources</a>
        </nav>
        <div className="nav-buttons">
          <button className="btn btn-login">LOG IN</button>
          <button className="btn btn-signup">SIGN UP</button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero">
        <h4>TRUSTED BY OVER 500K JOB SEEKERS!</h4>
        <h1>
          Land your <span>d job</span>. <br /> Withe stress.
        </h1>
        <p>
          AI Resume Builder • Automated Job Tracking • Optimize your LinkedIn
          Profile • And Much More...
        </p>
        <button className="btn-primary">SIGN UP FOR FREE</button>

        <div className="features">
          <div className="feature">
            <div className="feature-dot"></div> AI Resume Builder
          </div>
          <div className="feature">
            <div className="feature-dot"></div> Automated Job Tracking
          </div>
          <div className="feature">
            <div className="feature-dot"></div> Optimize your LinkedIn
          </div>
          <div className="feature">
            <div className="feature-dot"></div> And Much More...
          </div>
        </div>

        <div className="social-proof">
          <div className="avatars">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="user1"
            />
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="user2"
            />
            <img
              src="https://randomuser.me/api/portraits/men/51.jpg"
              alt="user3"
            />
            <img
              src="https://randomuser.me/api/portraits/men/60.jpg"
              alt="user4"
            />
          </div>
          <p>
            "I got recruiters from Amazon, Wise, and other companies reaching
            out already!"
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
