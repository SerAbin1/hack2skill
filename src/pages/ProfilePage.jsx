import React, { useEffect, useState } from "react";
import { auth, db } from '../firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import RoadmapFlow from "../components/RoadmapFlow";
import { ReactFlowProvider } from "reactflow"; // ✅ Added

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [roadmapData, setRoadmapData] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        } else {
          console.log("No profile data found!");
        }
      }
      setLoading(false);
    };
    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleShowRoadmap = async () => {
    setRoadmapLoading(true);
    setRoadmapData(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No logged-in user");
      
      const docRef = doc(db, "roadmaps", user.uid);
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

  const handleClearData = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const roadmapDocRef = doc(db, "roadmaps", user.uid);

      try {
        await deleteDoc(userDocRef);
        await deleteDoc(roadmapDocRef);
        setProfileData(null);
        setRoadmapData(null);
        alert("All data cleared successfully!");
      } catch (error) {
        console.error("Error clearing data:", error);
        alert("Failed to clear data. Please try again.");
      }
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!profileData) {
    return <div className="p-4">No profile data available. Please complete onboarding.</div>;
  }

  return (
    <div className="bg-gray-50 w-screen min-h-screen text-black flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-md w-full border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">User Profile</h2>
          <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm">
            Logout
          </button>
        </div>
        <div className="space-y-4">
          <p><strong>Name:</strong> {profileData.personalDetails?.name}</p>
          <p><strong>Age:</strong> {profileData.personalDetails?.age}</p>
          <p><strong>Field of Interest:</strong> {profileData.personalDetails?.field}</p>
          <p><strong>Education:</strong> {profileData.education?.lastEducation}</p>
          <p><strong>Work Experience:</strong> {profileData.work?.workExperience}</p>
          <p><strong>Interested Fields:</strong> {profileData.interestedFields?.checked?.join(", ")}</p>
          <p><strong>Skills:</strong> {profileData.skills?.checked?.join(", ")}</p>
        </div>
        <div className="mt-6 flex flex-col items-center">
          <button
            onClick={handleShowRoadmap}
            disabled={roadmapLoading}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            {roadmapLoading ? "Loading Roadmap..." : "Show My Learning Roadmap"}
          </button>
          <button
            onClick={handleClearData}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Clear All Data
          </button>
        </div>
      </div>

      {showRoadmapModal && roadmapData && (
        <div className="fixed inset-0 bg-black/5 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-3xl border border-gray-200 relative">
            <button onClick={handleCloseRoadmap} className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded-lg text-sm">
              Close
            </button>
            <h2 className="text-xl font-bold mb-4">Generated Roadmap</h2>
            
            {/* ✅ Wrap RoadmapFlow inside ReactFlowProvider */}
            <ReactFlowProvider>
              <RoadmapFlow roadmapData={roadmapData} />
            </ReactFlowProvider>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;