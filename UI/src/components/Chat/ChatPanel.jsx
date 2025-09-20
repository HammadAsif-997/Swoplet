import { useRef, useEffect } from 'react';
import { useContacts } from '../../context/ContactContext';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatPanel = () => {
  const { activeContactId, contacts, messages, sendMessage } = useContacts();
  const messagesEndRef = useRef(null);
  // Get user ID from localStorage
  const userId = localStorage.getItem('userId');
  const currentUserId = userId !== null && !isNaN(parseInt(userId)) ? parseInt(userId) : null;
  
  // Find active contact
  const activeContact = activeContactId 
    ? contacts.find(c => c.id === activeContactId) 
    : null;
    
  // Get messages for active contact
  const activeMessages = activeContactId 
    ? messages[activeContactId] || []
    : [];

  // Get product information to check if sold
  const fullContact = activeContact ? contacts.find(c => c.id === activeContact.id) : null;
  const originalChat = fullContact?._originalChat;
  const productStatus = originalChat?.product?.status;
  const productOwnerId = originalChat?.product?.created_by_id;
  const productTitle = originalChat?.product?.title;
  
  // Check if product is sold and if current user can still chat
  const isProductSold = productStatus === 3;
    
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages]);
  
  if (!activeContact) return null;
  
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <ChatHeader contact={activeContact} />
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <MessageList messages={activeMessages} contactId={activeContact.id} />
        <div ref={messagesEndRef} />
      </div>
      
      {/* Conditionally render MessageInput based on product status */}
      {!isProductSold ? (
        <MessageInput onSendMessage={sendMessage} />
      ) : (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="text-center p-4">
            <p className="text-sm text-gray-500">
              💬 This product "{productTitle}" has been sold.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Chat is no longer available for this item.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPanel;