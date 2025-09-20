import React from 'react';
import { Briefcase, Lightbulb, Zap, Target } from 'lucide-react';
import InputField from './InputField';

const UserInputForm = ({ userProfile, handleInputChange, handleStartAdvisor, error }) => (
  <form onSubmit={handleStartAdvisor} className="space-y-12">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <InputField 
        icon={<Briefcase className="h-5 w-5 text-gray-400" />}
        name="currentRole"
        placeholder="e.g., Software Engineer"
        value={userProfile.currentRole}
        onChange={handleInputChange}
        label="Current Role"
      />
      
      <InputField 
        icon={<Zap className="h-5 w-5 text-gray-400" />}
        name="skills"
        placeholder="e.g., React, Python, UI/UX"
        value={userProfile.skills}
        onChange={handleInputChange}
        label="Key Skills"
      />
      
      <InputField 
        icon={<Lightbulb className="h-5 w-5 text-gray-400" />}
        name="interests"
        placeholder="e.g., Artificial Intelligence, Sustainable Tech"
        value={userProfile.interests}
        onChange={handleInputChange}
        label="Your Interests"
      />
      
      <InputField 
        icon={<Target className="h-5 w-5 text-gray-400" />}
        name="goals"
        placeholder="e.g., Become a Product Manager"
        value={userProfile.goals}
        onChange={handleInputChange}
        label="Career Goals"
      />
    </div>
    
    {error && <p className="text-red-500 text-sm mt-6">{error}</p>}
    
    <button 
      type="submit" 
      className="btn btn-primary w-full flex items-center justify-center gap-2 mt-12"
    >
      <Zap className="h-5 w-5" />
      Generate My Career Plan
    </button>
  </form>
);

export default UserInputForm;
