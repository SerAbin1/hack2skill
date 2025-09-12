import React, { useEffect, useState } from "react";
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import RoadmapFlow from "../components/RoadmapFlow";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [roadmapData, setRoadmapData] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);

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

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!profileData) {
    return <div className="p-4">No profile data available. Please complete onboarding.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4">
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
        </div>
      </div>
      {roadmapData && (
        <div className="mt-8 bg-white shadow-xl rounded-2xl p-6 w-full max-w-3xl border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Generated Roadmap</h2>
          <RoadmapFlow roadmapData={roadmapData} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;