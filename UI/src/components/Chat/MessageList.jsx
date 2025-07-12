import MessageItem from './MessageItem';

const MessageList = ({ messages, contactId }) => {
  // Group messages by date
  const groupedMessages = [];
  
  messages.forEach(message => {
    const messageDate = new Date(message.timestamp).toLocaleDateString();
    const lastGroup = groupedMessages[groupedMessages.length - 1];
    
    if (lastGroup && lastGroup.date === messageDate) {
      lastGroup.messages.push(message);
    } else {
      groupedMessages.push({
        date: messageDate,
        messages: [message]
      });
    }
  });
    return (
    <div className="space-y-6">
      {groupedMessages.map((group, groupIndex) => (
        <div key={`${group.date}-${groupIndex}`} className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-600">
              {formatMessageDate(group.date)}
            </div>
          </div>
          {group.messages.map((message, messageIndex) => (
            <MessageItem 
              key={message.id || `${group.date}-${messageIndex}-${message.timestamp}`} 
              message={message} 
              isSender={message.sender === 'me'}
              showAvatar={shouldShowAvatar(group.messages, messageIndex, message.sender)}
              contactId={contactId}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// Format date to relative or absolute format
const formatMessageDate = (dateStr) => {
  // Try to parse common DD/MM/YYYY format
  const parseDate = (str) => {
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
      const [day, month, year] = str.split('/');
      return new Date(`${year}-${month}-${day}`);
    }
    return new Date(str);
  };
  
  const date = parseDate(dateStr);
  if (isNaN(date.getTime())) {
    console.error(`Invalid date received: ${dateStr}`);
    return 'Invalid Date';
  }

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isSameDate = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  if (isSameDate(date, today)) {
    return 'Today';
  } else if (isSameDate(date, yesterday)) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
};

// Determine if avatar should be shown for this message
const shouldShowAvatar = (messages, index, sender) => {
  // Always show avatar for the first message in a group
  if (index === 0) return true;
  
  // Show avatar if previous message was from a different sender
  const prevMessage = messages[index - 1];
  return prevMessage.sender !== sender;
};

export default MessageList;