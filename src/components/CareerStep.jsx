import React from 'react';
import { ArrowRight } from 'lucide-react';

const CareerStep = ({ stepData, stepNumber }) => (
  <div className="career-step">
    <div className="card p-6">
      <h3 className="text-lg font-bold mb-2">
        <span className="text-indigo-600 dark:text-indigo-400 mr-2">{stepNumber}.</span>
        {stepData.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6">{stepData.description}</p>
      
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Action Items:</h4>
        <ul className="space-y-2">
          {stepData.actionItems.map((item, i) => (
            <li key={i} className="flex items-start">
              <ArrowRight className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Skills to Develop:</h4>
        <div className="flex flex-wrap gap-2">
          {stepData.skillsToDevelop.map((skill, i) => (
            <span key={i} className="badge badge-primary">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default CareerStep;
