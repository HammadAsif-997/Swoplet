import { Check, CheckCheck } from 'lucide-react';
import { useContacts } from '../../context/ContactContext';
import { formatTime } from '../../../utils/dateUtils';

const MessageItem = ({ message, isSender, showAvatar, contactId }) => {
  const { contacts } = useContacts();
  const contact = contacts.find(c => c.id === contactId);
  
  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex max-w-[75%] ${isSender ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isSender && showAvatar ? (
          <div className="flex-shrink-0 h-8 w-8 mr-2">
            <img 
              src={contact?.avatar} 
              alt={contact?.name} 
              className="rounded-full h-8 w-8 object-cover"
            />
          </div>
        ) : (
          <div className={`flex-shrink-0 h-8 w-8 ${isSender ? 'ml-2' : 'mr-2'}`} />
        )}
        
        <div className={`relative ${isSender ? 'mr-2' : 'ml-2'}`}>
          <div 
            className={`p-3 rounded-lg ${
              isSender 
                ? 'bg-blue-500 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 rounded-tl-none'
            } shadow-sm`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
            <div className={`text-xs mt-1 flex items-center ${
              isSender ? 'text-blue-100 justify-end' : 'text-gray-500'
            }`}>
              <span>{formatTime(message.timestamp)}</span>
              {isSender && (
                <span className="ml-1">
                  {message.status === 'sent' && <Check size={14} />}
                  {message.status === 'delivered' && <Check size={14} />}
                  {message.status === 'read' && <CheckCheck size={14} />}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;