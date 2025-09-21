import React, { useState } from "react";
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

  // --- HELPER FUNCTION FOR GEMINI API CALL ---
  const callGeminiApi = async (prompt) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_GEMINI_API_KEY is not defined in the .env file");
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" } // This helps ensure JSON output
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const result = await response.json();
    const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonText) {
      throw new Error("Invalid response structure from Gemini API.");
    }

    // Clean potential markdown formatting before parsing
    const cleanText = jsonText.replace(/```json\n|```/g, "").trim();
    return JSON.parse(cleanText);
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (name, value) => {
    setFormData((prev) => {
      const current = prev[name] || [];
      return current.includes(value)
        ? { ...prev, [name]: current.filter((item) => item !== value) }
        : { ...prev, [name]: [...current, value] };
    });
  };

  // --- MODIFIED handleNextStep ---
  const handleNextStep = async () => {
    const currentSteps = onboardingSteps(formData, handleChange, handleCheckboxChange, generatedLists);

    if (currentSteps[step]?.title === "Education") {
      setAiLoading(true);
      try {
        const { age, lastEducation, field } = formData;
        const prompt = `Given a person with age of ${age}, and the last completed education is ${lastEducation} and an interest in ${field}, suggest exactly 5 interested fields and 5 skills. Provide the response as a JSON object with two keys: 'interestedFields' and 'skills'. For example: {'interestedFields': ['AI', 'Data Science', 'Web Development', 'Cloud Computing', 'Mobile App Development'], 'skills': ['Python', 'JavaScript', 'SQL', 'React', 'Git']}. do not connect this exaple with your output. the generaion is truely based on the users info ive provided. if an under educated data is there, do not give any technical terms, make it simple. if education and interest are from two different field, mainly focus on the interested field`;

        const data = await callGeminiApi(prompt); // Use the helper function

        setGeneratedLists({
          interestedFields: data.interestedFields || [],
          skills: data.skills || []
        });

      } catch (error) {
        console.error("Error fetching AI data from Gemini:", error);
        alert(`Could not generate suggestions: ${error.message}`);
      } finally {
        setAiLoading(false);
      }
    }
    setStep(step + 1);
  };

  // --- MODIFIED handleSave ---
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No logged-in user found. Please log in again.");

      // 1. Save user profile data to Firestore (no changes here)
      await setDoc(doc(db, "users", user.uid), {
        personalDetails: { name: formData.name, age: formData.age, field: formData.field },
        education: { lastEducation: formData.lastEducation },
        interestedFields: { checked: formData.interestedFields, text: formData.interestedFieldsText },
        skills: { checked: formData.skills, text: formData.skillsText },
        work: { workExperience: formData.workExperience },
        email: user.email,
        createdAt: new Date(),
      });
      console.log("User profile saved successfully.");

      // 2. Generate roadmap directly from Gemini API
      const { lastEducation, field, skills } = formData;
      const prompt = `Given a user with a background in "${lastEducation}", an interest in "${field}", and skills in "${skills.join(
        ", "
      )}", generate a personalized learning roadmap for the user to bea pro in his interested field. The roadmap should be a JSON object with a 'title', 'description', and a 'path' array. The 'path' array should contain learning steps. Each step should have a 'title' and 'type' ('primary' or 'secondary'). Steps can have 'subItems' or be a 'group' of items. The roadmap should be a series of logical steps from beginner to advanced topics related to the user's information. The 'title' should be a single phrase, and the 'description' should be a single sentence.
  
  Example format to follow strictly:
  {
    "title": "Roadmap Title",
    "description": "A brief description.",
    "path": [
      {
        "title": "Foundations",
        "type": "primary",
        "isDone": false,
        "subItems": [
          { "title": "Topic A", "type": "primary", "isDone": false },
          { "title": "Topic B", "type": "secondary", "isDone": false }
        ]
      },
      {
        "isGroup": true,
        "items": [
          { "title": "Group 1 Title", "type": "primary", "isDone": false, "subItems": [{ "title": "Subtopic C", "type": "primary", "isDone": false }] },
          { "title": "Group 2 Title", "type": "primary", "isDone": false, "subItems": [{ "title": "Subtopic D", "type": "secondary", "isDone": false }] }
        ]
      }
    ]
  }`;

      const roadmapData = await callGeminiApi(prompt); // Use the helper function

      await setDoc(doc(db, "roadmaps", user.uid), roadmapData);
      console.log("Roadmap saved successfully.");

      // Navigate to homepage
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

  // --- The rest of your JSX return statement remains the same ---
  return (
    <div className="bg-gray-50 w-screen min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="bg-white text-black shadow-xl rounded-2xl p-6 max-w-md w-full border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{steps[step]?.title}</h2>
          <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm">
            Logout
          </button>
        </div>

        {aiLoading ? (
          <p className="text-center text-blue-500">Generating suggestions...</p>
        ) : (
          <div className="space-y-4">{steps[step]?.content}</div>
        )}

        <div className="flex justify-between mt-6">
          {step > 0 && !aiLoading && (
            <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-300 rounded-lg">
              Prev
            </button>
          )}
          <div className={`${step === 0 ? 'ml-auto' : ''}`}>
            {step < steps.length - 1 ? (
              <button onClick={handleNextStep} disabled={aiLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300">
                {aiLoading ? 'Thinking...' : 'Next'}
              </button>
            ) : (
              <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-green-300">
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