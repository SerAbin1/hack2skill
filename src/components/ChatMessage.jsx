import React from 'react';
import { User, Bot } from 'lucide-react';

const ChatMessage = ({ message }) => {
  const isAi = message.sender === 'ai';
  
  return (
    <div className={`chat-message flex ${isAi ? 'justify-start' : 'justify-end'}`}>
      {isAi && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mr-3">
          <Bot size={20} />
        </div>
      )}
      
      <div className={`chat-bubble ${isAi ? 'chat-bubble-ai' : 'chat-bubble-user'}`}>
        <p className="text-sm">{message.text}</p>
      </div>
      
      {!isAi && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center ml-3">
          <User size={20} className="text-gray-600 dark:text-gray-300" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
