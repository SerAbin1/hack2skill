import React from 'react';
import { Send } from 'lucide-react';

const ChatInputForm = ({ userInput, setUserInput, handleSendMessage, isLoading }) => {
  return (
    <form onSubmit={handleSendMessage}>
      <div className="relative">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask a follow-up question..."
          className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-300  bg-white  focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isLoading}
          autoFocus
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={isLoading || !userInput.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default ChatInputForm;