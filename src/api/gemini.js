// src/api/gemini.js

const API_BASE_URL = 'http://localhost:3000'; // Or your backend's deployed URL

export const generateBioWithAI = async (formData) => {
  try {
    const prompt = `Write a short professional bio for someone named ${formData.name} who is ${formData.age} years old and interested in ${formData.field}.`;
    
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    if (response.ok) {
      return data.result;
    } else {
      throw new Error(data.error || 'Failed to generate content from AI.');
    }
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};