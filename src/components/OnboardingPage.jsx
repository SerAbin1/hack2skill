import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { steps as onboardingSteps } from "./OnboardingSteps.jsx";

const OnboardingPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    field: "",
    lastEducation: "",
    interestedFields: [],
    interestedFieldsText: "",
    skills: [],
    skillsText: "",
    workExperience: "",
  });

  const [generatedLists, setGeneratedLists] = useState({ interestedFields: [], skills: [] });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  // Removed 'success' state as it's not used before navigating away


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (name, value) => {
    setFormData((prev) => {
      const current = prev[name] || [];
      if (current.includes(value)) {
        return { ...prev, [name]: current.filter((item) => item !== value) };
      } else {
        return { ...prev, [name]: [...current, value] };
      }
    });
  };

  const handleNextStep = async () => {
    const currentSteps = onboardingSteps(formData, handleChange, handleCheckboxChange, generatedLists);

    if (currentSteps[step]?.title === "Education") {
      setAiLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/generate-lists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            education: formData.lastEducation,
            field: formData.field,
            age: formData.age,
          }),
        });

        // Add this check to see if the API call was successful
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch suggestions.');
        }

        const data = await response.json();
        setGeneratedLists({
          interestedFields: data.interestedFields || [],
          skills: data.skills || []
        });
      } catch (error) {
        console.error("Error fetching AI data:", error);
        alert(`Could not generate suggestions: ${error.message}`); // Inform the user
      } finally {
        setAiLoading(false);
      }
    }
    setStep(step + 1);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No logged-in user found. Please log in again.");

      // 1. Save user profile data to Firestore
      const userProfile = {
        personalDetails: {
          name: formData.name,
          age: formData.age,
          field: formData.field,
        },
        education: {
          lastEducation: formData.lastEducation,
        },
        interestedFields: {
          checked: formData.interestedFields,
          text: formData.interestedFieldsText,
        },
        skills: {
          checked: formData.skills,
          text: formData.skillsText,
        },
        work: {
          workExperience: formData.workExperience,
        },
        email: user.email,
        createdAt: new Date(),
      };
      await setDoc(doc(db, "users", user.uid), userProfile);
      console.log("User profile saved successfully.");


      // 2. Generate and save the roadmap
      const roadmapResponse = await fetch('http://localhost:3000/api/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          education: formData.lastEducation,
          field: formData.field,
          skills: formData.skills,
        }),
      });

      if (!roadmapResponse.ok) {
        const errorData = await roadmapResponse.json();
        throw new Error(errorData.message || 'Failed to generate roadmap from server.');
      }

      const roadmapData = await roadmapResponse.json();
      await setDoc(doc(db, "roadmaps", user.uid), roadmapData);
      console.log("Roadmap saved successfully.");

      // If all await calls succeed, force a full page navigation.
      console.log("All data saved. Forcing a reload to the homepage...");
      window.location.href = "/homepage";

    } catch (err) {
      console.error("An error occurred during the save process:", err);
      alert(`Error: ${err.message}`); 
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const steps = onboardingSteps(formData, handleChange, handleCheckboxChange, generatedLists);

  return (
    <div className="bg-gray-50 w-screen min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="bg-white text-black shadow-xl rounded-2xl p-6 max-w-md w-full border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{steps[step]?.title}</h2>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
          >
            Logout
          </button>
        </div>

        {/* Step Content */}
        {aiLoading ? (
          <p className="text-center text-blue-500">Generating suggestions...</p>
        ) : (
          <div className="space-y-4">{steps[step]?.content}</div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 0 && !aiLoading && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Prev
            </button>
          )}
          {/* Ensure the Prev button is offset correctly when there is no Next button */}
          <div className={`${step === 0 ? 'ml-auto' : ''}`}>
             {step < steps.length - 1 ? (
                <button
                  onClick={handleNextStep}
                  disabled={aiLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300"
                >
                  {aiLoading ? 'Thinking...' : 'Next'}
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-green-300"
                >
                  {loading ? "Saving..." : "Submit"}
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;