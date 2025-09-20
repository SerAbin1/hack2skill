import React, { useState, useEffect, useRef } from 'react';
import { Target, Bot, Loader2 } from 'lucide-react';
import WelcomeScreen from '../components/WelcomeScreen';
import UserInputForm from '../components/UserInputForm';
import ChatMessage from '../components/ChatMessage';
import CareerPlanDisplay from '../components/CareerPlanDisplay';
import './career.css';


// Main Application Component
const CareerAdvisor = () => {
  // State management for the application
  const [userProfile, setUserProfile] = useState({ currentRole: '', skills: '', interests: '', goals: '' });
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [careerPlan, setCareerPlan] = useState(null);
  const [currentStep, setCurrentStep] = useState(0); // 0: Input Form, 1: Loading/Conversation, 2: Plan Displayed
  const [error, setError] = useState(null);

  const chatContainerRef = useRef(null);

  // Effect to initialize the conversation
  useEffect(() => {
      if (currentStep === 0) {
        setConversation([{
          sender: 'ai',
          text: "Welcome to GURU your AI Mentor! To start, please share your current role, key skills, interests, and career goals. Let's chart your path to success."
        }]);
      }
    }, [currentStep]);

  // Effect to auto-scroll the chat window
  //useEffect(() => {
   // if (chatContainerRef.current) {
   //   chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  //  }
 // }, [conversation]);

  // Handles updates to the user input form with debouncing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Use functional update to ensure we're working with the latest state
    setUserProfile(prev => {
      // Only update if the value has actually changed
      if (prev[name] === value) return prev;
      return { ...prev, [name]: value };
    });
  };

  // Main function to start the career advice generation
  const handleStartAdvisor = (e) => {
    e.preventDefault();
    const { currentRole, skills, interests, goals } = userProfile;
    if (!currentRole || !skills || !interests || !goals) {
      setError("Please fill out all fields to receive the most accurate advice.");
      return;
    }
    setError(null);
    const userPrompt = `Current Role: ${currentRole}\nSkills: ${skills}\nInterests: ${interests}\nGoals: ${goals}`;
    setConversation(prev => [...prev, { sender: 'user', text: `Here are my details:\n- Role: ${currentRole}\n- Skills: ${skills}\n- Interests: ${interests}\n- Goal: ${goals}` }]);
    setCurrentStep(1);
    generateCareerAdvice(userPrompt);
  };
  
  // Async function to call the Gemini API
  const generateCareerAdvice = async (prompt) => {
    setIsLoading(true);
    setCareerPlan(null);

    // This system prompt instructs the AI to be a proactive advisor and return structured JSON
    const systemPrompt = `You are 'Career Compass AI', a world-class, proactive AI career advisor. Your primary function is to provide a personalized, actionable, and inspiring career roadmap based on user input.

    **Core Instructions:**
    1.  **Analyze Holistically:** Deeply analyze the user's provided profile: their current role, existing skills, stated interests, and long-term goals.
    2.  **Be Proactive & Insightful:** Do not provide generic or obvious advice. Your value is in identifying unconventional paths, emerging high-demand fields, and niche specializations that align with the user's profile but they might not have considered. Think outside the box.
    3.  **MANDATORY - Structured JSON Output:** You MUST return your response as a single, valid JSON object. Do not include any text, markdown, or commentary outside of the JSON structure. The JSON object must strictly adhere to the following schema:
        {
          "title": "A Personalized Career Roadmap to Become a [User's Goal]",
          "summary": "A brief, professional, and encouraging summary of the proposed strategic path.",
          "steps": [
            {
              "step": 1,
              "title": "[Short-Term Actionable Goal, e.g., 'Master Foundational AI Concepts']",
              "duration": "[Estimated Time, e.g., '3-6 Months']",
              "description": "A detailed paragraph explaining the importance and focus of this step.",
              "actionItems": ["Specific, actionable task 1", "Specific, actionable task 2", "Specific, actionable task 3"],
              "skillsToDevelop": ["Key Skill 1", "Key Skill 2"]
            },
            {
              "step": 2,
              "title": "[Mid-Term Practical Goal, e.g., 'Build a Portfolio of Practical Projects']",
              "duration": "[Estimated Time, e.g., '6-12 Months']",
              "description": "A detailed paragraph explaining the importance and focus of this step.",
              "actionItems": ["Specific, actionable task 1", "Specific, actionable task 2", "Specific, actionable task 3"],
              "skillsToDevelop": ["Key Skill 1", "Key Skill 2"]
            },
            {
              "step": 3,
              "title": "[Long-Term Career Transition Goal, e.g., 'Strategize and Transition into a Target Role']",
              "duration": "[Estimated Time, e.g., '1-2 Years']",
              "description": "A detailed paragraph explaining the importance and focus of this step.",
              "actionItems": ["Specific, actionable task 1", "Specific, actionable task 2", "Specific, actionable task 3"],
              "skillsToDevelop": ["Key Skill 1", "Key Skill 2"]
            }
          ]
        }
    4.  **Tone:** Maintain an encouraging, insightful, and professional tone throughout the content of the JSON fields.`;

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error("Please add your Gemini API key to the .env file");
      }
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { responseMimeType: "application/json" }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}. Please try again.`);
      }

      const result = await response.json();
      
      const candidate = result.candidates?.[0];
      if (candidate?.content?.parts?.[0]?.text) {
        const jsonText = candidate.content.parts[0].text;
        const parsedPlan = JSON.parse(jsonText);
        setCareerPlan(parsedPlan);
        setConversation(prev => [...prev, {
          sender: 'ai',
          text: "Excellent. I've analyzed your profile and crafted a personalized career roadmap for you. Here is your strategic path to success."
        }]);
        setCurrentStep(2);
      } else {
        throw new Error("The AI returned an unexpected response format. Please refine your inputs.");
      }

    } catch (error) {
      console.error("Error generating career advice:", error);
      const errorMessage = `I apologize, but I encountered an issue while creating your plan. Error: ${error.message}`;
      setConversation(prev => [...prev, { sender: 'ai', text: errorMessage }]);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Resets the application to its initial state
  const handleReset = () => {
    setUserProfile({ currentRole: '', skills: '', interests: '', goals: '' });
    setConversation([]);
    setCareerPlan(null);
    setCurrentStep(0);
    setError(null);
  };
    

  // --- Main Render Method ---
  return (
    <div className="app-container">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Panel: User Interaction */}
          <div className="card flex flex-col h-[90vh] max-h-[900px]">
            <div className="p-6">
              <WelcomeScreen />
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            <div className="p-6 flex-grow">
              {currentStep === 0 && (
                <UserInputForm 
                  userProfile={userProfile}
                  handleInputChange={handleInputChange}
                  handleStartAdvisor={handleStartAdvisor}
                  error={error}
                />
              )}
              {(currentStep > 0) && (
                <div ref={chatContainerRef} className="flex-grow overflow-y-auto pr-4 -mr-4 custom-scrollbar">
                  {conversation.map((msg, index) => <ChatMessage key={index} message={msg} />)}
                  {isLoading && (
                    <div className="chat-message flex justify-start animate-fade-in">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mr-3">
                        <Bot size={20} />
                      </div>
                      <div className="chat-bubble chat-bubble-ai flex items-center">
                        <Loader2 className="animate-spin text-indigo-500"/>
                        <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">Crafting your personalized plan...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: AI Output */}
          <div className="card bg-gray-50 flex flex-col h-[90vh] max-h-[900px] overflow-y-auto custom-scrollbar">
            <div className="p-6 flex-grow">
              {!careerPlan && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="relative w-48 h-48 mb-6 pulse-animation">
                    <div className="absolute inset-0 bg-indigo-200 dark:bg-indigo-900 rounded-full opacity-70"></div>
                    <div className="absolute inset-4 bg-indigo-300 dark:bg-indigo-800 rounded-full opacity-70"></div>
                    <div className="absolute inset-8 bg-indigo-400 dark:bg-indigo-700 rounded-full opacity-70"></div>
                    <Target className="absolute inset-0 m-auto h-20 w-20 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Your Future Awaits</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
                    Your personalized career roadmap will appear here once you provide your details.
                  </p>
                </div>
              )}
              {careerPlan && <CareerPlanDisplay plan={careerPlan} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CareerAdvisor;