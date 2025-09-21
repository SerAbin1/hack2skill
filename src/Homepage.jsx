import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";
import ResumeUpload from "./components/ResumeUpload";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { ReactFlowProvider } from "reactflow";
import RoadmapFlow from "./components/RoadmapFlow";

const Homepage = () => {
  const [user, loading] = useAuthState(auth);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [roadmapData, setRoadmapData] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);

  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [salaryLoading, setSalaryLoading] = useState(false);
  const [salaryResult, setSalaryResult] = useState({ insights: "", context: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        } else {
          console.log("No profile data found!");
        }
      }
      setProfileLoading(false);
    };
    fetchProfileData();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleShowRoadmap = async () => {
    setRoadmapLoading(true);
    setRoadmapData(null);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No logged-in user");

      const docRef = doc(db, "roadmaps", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setRoadmapData(docSnap.data());
        setShowRoadmapModal(true);
      } else {
        alert("No roadmap found. Please contact support.");
      }
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      alert("Failed to fetch roadmap. Please try again.");
    } finally {
      setRoadmapLoading(false);
    }
  };

  const handleCloseRoadmap = () => {
    setShowRoadmapModal(false);
  };

  // --- UPDATED Function for Salary Insights ---
  const handleShowSalary = async () => {
    const interestedFields = profileData?.interestedFields?.checked || [];
    const skills = profileData?.skills?.checked || [];

    if (interestedFields.length === 0 && skills.length === 0) {
      alert(
        "Please complete your profile with skills or interested fields to get salary insights."
      );
      return;
    }

    const location = "India";
    const contextForDisplay = [...interestedFields, ...skills].join(", ");

    setShowSalaryModal(true);
    setSalaryLoading(true);
    setSalaryResult({ insights: "", context: "" }); // Clear previous results

    try {
      const res = await fetch("http://localhost:3000/api/salary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ✅ Send both arrays to the backend
        body: JSON.stringify({ interestedFields, skills, location }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch salary data from the server.");
      }

      const data = await res.json();
      setSalaryResult({ insights: data.insights, context: contextForDisplay });
    } catch (error) {
      console.error("Error fetching salary insights:", error);
      setSalaryResult({
        insights:
          "Sorry, I couldn't fetch salary insights right now. Please try again later.",
        context: contextForDisplay,
      });
    } finally {
      setSalaryLoading(false);
    }
  };

  const handleCloseSalary = () => {
    setShowSalaryModal(false);
  };

  if (loading || profileLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="landing-container w-screen bg-black/10">
      {/* TOP NAV */}
      <div className="top-nav">
        <div className="top-right">
          <div className="avatar" onClick={() => setProfileOpen(!profileOpen)}>
            <span className="icon cursor-pointer">👥</span>
          </div>
        </div>
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

      {/* PROFILE DROPDOWN */}
      {profileOpen && (
        <div className="profile-dropdown">
          <h2>👤 Profile</h2>
          {profileData ? (
            <>
              <div className="form-box">
                <label>Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={profileData.personalDetails?.name}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{profileData.personalDetails?.name}</span>
                )}
              </div>
              <div className="form-box">
                <label>Education</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="education"
                    value={profileData.education?.lastEducation}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{profileData.education?.lastEducation}</span>
                )}
              </div>
              <div className="form-box">
                <label>Skills</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="skills"
                    value={profileData.skills?.checked.join(", ")}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{profileData.skills?.checked.join(", ")}</span>
                )}
              </div>
              <div className="form-box">
                <label>Interested Fields</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="interestedFields"
                    value={profileData.interestedFields?.checked.join(", ")}
                    onChange={handleChange}
                  />
                ) : (
                  <span>
                    {profileData.interestedFields?.checked.join(", ")}
                  </span>
                )}
              </div>
              <div className="form-box">
                <label>Work Experience</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="workExperience"
                    value={profileData.work?.workExperience}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{profileData.work?.workExperience}</span>
                )}
              </div>
            </>
          ) : (
            <div>No profile data available.</div>
          )}

          {!isEditing ? (
            <button className="edit-toggle" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          ) : (
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          )}

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      {/* BUTTON GRID */}
      <div className="button-grid">
        <button className="menu-btn" onClick={handleShowSalary}>
          💰 Salary Insights
        </button>
        <ResumeUpload />
        <button className="menu-btn" onClick={handleShowRoadmap}>
          {roadmapLoading ? "Loading Roadmap..." : "Career Roadmap"}
        </button>
        <button
          className="menu-btn"
          onClick={() => navigate("/careeradvisor")}
        >
          Career Explorer
        </button>
      </div>

      {/* HERO SECTION */}
      <div className="hero-text">
        <h2>Welcome, {profileData?.personalDetails?.name || "User"}</h2>
        <p>What career suits me if I love design?</p>
        <p>Suggested Careers: UX Designer, Product Designer Cocersza</p>
        <button className="btn-primary">Try Mock Interview</button>
      </div>

      {/* Roadmap Modal */}
      {showRoadmapModal && roadmapData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-5000">
          <div className="bg-white shadow-xl text-black rounded-2xl min-h-[100vh] p-6 w-full max-w-[90vw] h-[90vh] border border-gray-200 relative">
            <button
              onClick={handleCloseRoadmap}
              className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg text-sm z-10"
            >
              Close
            </button>
            <h2 className="text-xl font-bold mb-4">Generated Roadmap</h2>
            <ReactFlowProvider>
              <RoadmapFlow roadmapData={roadmapData} />
            </ReactFlowProvider>
          </div>
        </div>
      )}

      {/* --- UPDATED Salary Insights Modal --- */}
      {showSalaryModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white shadow-xl rounded-2xl p-6 w-full max-w-md border border-purple-400 relative mx-4">
            <button
              onClick={handleCloseSalary}
              className="absolute top-3 right-3 px-3 py-1 bg-red-600 text-white rounded-lg text-sm"
            >
              Close
            </button>
            <h2 className="text-2xl font-bold mb-4 text-purple-300">
              Salary Insights
            </h2>
            {salaryLoading ? (
              <p>Fetching insights for you...</p>
            ) : (
              <div>
                {/* ✅ Display the context used for the query */}
                <p className="text-lg font-semibold mb-2">
                  Based on:{" "}
                  <span className="capitalize font-normal text-purple-300">
                    {salaryResult.context}
                  </span>
                </p>
                <div className="mt-4 bg-gray-900 p-4 rounded-lg whitespace-pre-wrap">
                  <p className="text-gray-300">{salaryResult.insights}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;