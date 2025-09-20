import React from 'react';
import CareerStep from './CareerStep';

const CareerPlanDisplay = ({ plan }) => (
  <div className="space-y-6 animate-fade-in">
    <div className="card card-highlight p-6">
      <h2 className="text-xl font-bold mb-4">{plan.title}</h2>
      <p className="text-gray-600 dark:text-gray-300">{plan.summary}</p>
    </div>
    
    <div className="space-y-8 mt-8">
      <h3 className="text-lg font-semibold">Your Career Roadmap</h3>
      {plan.steps.map((step, index) => (
        <CareerStep key={index} stepData={step} stepNumber={index + 1} />
      ))}
    </div>
  </div>
);

export default CareerPlanDisplay;
