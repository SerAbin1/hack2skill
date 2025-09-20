import React from 'react';
import { BrainCircuit } from 'lucide-react';

const WelcomeScreen = () => (
  <div className="text-center mb-12">
    <div className="mx-auto bg-primary w-20 h-20 rounded-[20px] flex items-center justify-center shadow-lg mb-8">
      <BrainCircuit className="text-white h-10 w-10" />
    </div>
    <h1 className="app-title mb-6">GURU your AI Mentor</h1>
    <p className="text-lg text-gray-600">Your Proactive Partner in Professional Growth.</p>
  </div>
);

export default WelcomeScreen;
