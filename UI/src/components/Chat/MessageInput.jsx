import { useState } from 'react';
import { Send } from 'lucide-react';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  
  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="px-4 py-3 border-t border-gray-200 bg-white">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full p-3 rounded-lg bg-gray-100 text-gray-800 
              placeholder-gray-500 resize-none max-h-32 focus:outline-none 
              focus:ring-2 focus:ring-blue-500"
            rows={1}
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
        </div>
        <button 
          onClick={handleSend}
          className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;