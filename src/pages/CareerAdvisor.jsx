import React, { useState, useEffect, useRef } from 'react';
import { Target, Bot, Loader2 } from 'lucide-react';
import WelcomeScreen from '../components/WelcomeScreen';
import ChatMessage from '../components/ChatMessage';
import CareerPlanDisplay from '../components/CareerPlanDisplay';
import ChatInputForm from '../components/ChatInputForm';
import './career.css';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

// Main Application Component
const CareerAdvisor = () => {
  const [user] = useAuthState(auth);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [careerPlan, setCareerPlan] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);
  const [userInput, setUserInput] = useState('');

  // ✅ New state variable to explicitly store the user's details summary
  const [userProfileSummary, setUserProfileSummary] = useState('');

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        } else {
          setError("No profile data found! Please complete the onboarding process.");
        }
      }
      setProfileLoading(false);
    };
    fetchProfileData();
  }, [user]);

  useEffect(() => {
    if (currentStep === 0) {
      setConversation([{
        sender: 'ai',
        text: "Welcome to GURU your AI Mentor! Click the button below to generate a personalized career plan based on your profile."
      }]);
    }
  }, [currentStep]);

  const handleStartAdvisor = () => {
    if (!profileData) {
      setError("Profile data is not loaded yet.");
      return;
    }
    setError(null);

    const { personalDetails, skills, interestedFields, work } = profileData;
    // ✅ Create and store the user's details in our new state variable
    const summaryText = `Based on my profile:\n- Current Focus/Goal: ${personalDetails?.field || 'Not specified'}\n- Skills: ${skills?.checked?.join(', ') || 'Not specified'}\n- Interests: ${interestedFields?.checked?.join(', ') || 'Not specified'}\n- Experience: ${work?.workExperience || 'Not specified'}`;
    setUserProfileSummary(summaryText);

    setConversation(prev => [...prev, { sender: 'user', text: "Please generate my career plan." }]);
    setCurrentStep(1);
    generateCareerAdvice(summaryText);
  };

  const generateCareerAdvice = async (prompt) => {
    setIsLoading(true);
    setCareerPlan(null);
    const systemPrompt = `You are 'Career Compass AI', a world-class AI career advisor. Your primary function is to provide a personalized, actionable career roadmap based on user input. You MUST return your response as a single, valid JSON object strictly adhering to this schema:
        {
          "title": "A Personalized Career Roadmap for [User's Goal]",
          "summary": "A brief, professional, and encouraging summary of the proposed path.",
          "steps": [
            {"step": 1, "title": "[Short-Term Goal]", "duration": "[e.g., '3-6 Months']", "description": "Detailed paragraph.", "actionItems": ["Task 1", "Task 2"], "skillsToDevelop": ["Skill 1", "Skill 2"]},
            {"step": 2, "title": "[Mid-Term Goal]", "duration": "[e.g., '6-12 Months']", "description": "Detailed paragraph.", "actionItems": ["Task 1", "Task 2"], "skillsToDevelop": ["Skill 1", "Skill 2"]},
            {"step": 3, "title": "[Long-Term Goal]", "duration": "[e.g., '1-2 Years']", "description": "Detailed paragraph.", "actionItems": ["Task 1", "Task 2"], "skillsToDevelop": ["Skill 1", "Skill 2"]}
          ]
        }`;

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("VITE_GEMINI_API_KEY not found in .env file");
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { responseMimeType: "application/json" }
      };
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
      const result = await response.json();
      const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (jsonText) {
        const parsedPlan = JSON.parse(jsonText);
        setCareerPlan(parsedPlan);
        setConversation(prev => [...prev, { sender: 'ai', text: "Excellent. I've analyzed your profile and crafted a personalized career roadmap. You can now ask me any follow-up questions." }]);
        setCurrentStep(2);
      } else {
        throw new Error("The AI returned an unexpected response format.");
      }
    } catch (error) {
      const errorMessage = `I apologize, but I encountered an issue. Error: ${error.message}`;
      setConversation(prev => [...prev, { sender: 'ai', text: errorMessage }]);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ New helper function to summarize the conversation history
  const summarizeConversation = async (chatHistory) => {
    if (chatHistory.length === 0) {
      return "No conversation has happened yet.";
    }
    const historyText = chatHistory.map(msg => `${msg.sender === 'ai' ? 'AI' : 'User'}: ${msg.text}`).join('\n');
    const prompt = `Please provide a concise, one-paragraph summary of the key points from the following conversation:\n\n${historyText}`;

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API key not found.");
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const payload = { contents: [{ parts: [{ text: prompt }] }] };
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error("Summarization failed.");
      const result = await response.json();
      return result.candidates?.[0]?.content?.parts?.[0]?.text || "Could not summarize the conversation.";
    } catch (error) {
      console.error("Summarization error:", error);
      return "There was an error summarizing the conversation.";
    }
  };

  const handleSendFollowUp = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    const newUserMessage = { sender: 'user', text: userInput };
    const currentConversation = [...conversation]; // Capture conversation before adding new message
    setConversation(prev => [...prev, newUserMessage]);
    setUserInput("");
    setIsLoading(true);

    // ✅ 1. Summarize the previous messages and store the summary in a variable
    const conversationSummary = await summarizeConversation(currentConversation);

    // ✅ 2. Call the main AI with the user profile, the summary, and the new message
    await generateFollowUp(conversationSummary, newUserMessage.text);
  };

  // ✅ This function now takes the generated summary instead of the whole history
  const generateFollowUp = async (historySummary, latestUserMessage) => {
    const followUpSystemPrompt = `You are 'Career Compass AI', a supportive career mentor. You are continuing a conversation. You will be provided with the user's profile, a summary of your previous conversation, and the user's newest message. Use all this information to provide a helpful, conversational, and concise response. Do not output JSON.`;

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error("API key not found.");
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      // ✅ Construct a new, consolidated prompt with the summaries
      const fullPrompt = `USER PROFILE:\n${userProfileSummary}\n\nCONVERSATION SUMMARY:\n${historySummary}\n\nUSER'S NEW MESSAGE:\n${latestUserMessage}`;
      const payload = {
        contents: [{ parts: [{ text: fullPrompt }] }],
        systemInstruction: { parts: [{ text: followUpSystemPrompt }] }
      };

      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`API call failed: ${response.status}`);
      const result = await response.json();
      const aiResponseText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (aiResponseText) {
        setConversation(prev => [...prev, { sender: 'ai', text: aiResponseText }]);
      } else {
        throw new Error("AI returned an empty response.");
      }
    } catch (error) {
      const errorMessage = `Sorry, I ran into a problem: ${error.message}`;
      setConversation(prev => [...prev, { sender: 'ai', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card flex flex-col h-[90vh] max-h-[900px]">
            <div className="p-6">
              <WelcomeScreen />
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            <div ref={chatContainerRef} className="p-6 flex-grow overflow-y-auto custom-scrollbar">
              {conversation.map((msg, index) => <ChatMessage key={index} message={msg} />)}
              {isLoading && (
                <div className="chat-message flex justify-start animate-fade-in">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mr-3">
                    <Bot size={20} />
                  </div>
                  <div className="chat-bubble chat-bubble-ai flex items-center">
                    <Loader2 className="animate-spin text-indigo-500" />
                    <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              {currentStep === 0 && (
                <div className="text-center">
                  {profileLoading ? (<p className="text-gray-500">Loading your profile...</p>) : (<button onClick={handleStartAdvisor} className="btn btn-primary w-full flex items-center justify-center gap-2" disabled={isLoading}>Generate My Career Plan</button>)}
                </div>
              )}
              {currentStep === 2 && (<ChatInputForm userInput={userInput} setUserInput={setUserInput} handleSendMessage={handleSendFollowUp} isLoading={isLoading} />)}
              {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </div>
          </div>
          <div className="card bg-gray-50 flex flex-col h-[90vh] max-h-[900px] overflow-y-auto custom-scrollbar">
            <div className="p-6 flex-grow">
              {!careerPlan ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="relative w-48 h-48 mb-6 pulse-animation">
                    <div className="absolute inset-0 bg-indigo-200 dark:bg-indigo-900 rounded-full opacity-70"></div>
                    <div className="absolute inset-4 bg-indigo-300 dark:bg-indigo-800 rounded-full opacity-70"></div>
                    <div className="absolute inset-8 bg-indigo-400 dark:bg-indigo-700 rounded-full opacity-70"></div>
                    <Target className="absolute inset-0 m-auto h-20 w-20 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Your Future Awaits</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">Your personalized career roadmap will appear here once you generate it.</p>
                </div>
              ) : (<CareerPlanDisplay plan={careerPlan} />)}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CareerAdvisor;