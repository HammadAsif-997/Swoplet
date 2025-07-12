export const contacts = [
  {
    id: 'user1',
    name: 'Alex Morgan',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastMessage: 'See you tomorrow!',
    lastMessageTime: new Date(Date.now() - 15 * 60000),
    unreadCount: 2
  },
  {
    id: 'user2',
    name: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastMessage: 'Thanks for the update',
    lastMessageTime: new Date(Date.now() - 2 * 3600000)
  },
  {
    id: 'user3',
    name: 'James Wilson',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastMessage: 'Can we reschedule?',
    lastMessageTime: new Date(Date.now() - 8 * 3600000),
    unreadCount: 1
  },
  {
    id: 'user4',
    name: 'Emily Davis',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastMessage: 'Just sent you the files',
    lastMessageTime: new Date(Date.now() - 1 * 86400000)
  },
  {
    id: 'user5',
    name: 'Michael Brown',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastMessage: 'Let me know when you arrive',
    lastMessageTime: new Date(Date.now() - 2 * 86400000)
  },
  {
    id: 'user6',
    name: 'Olivia Smith',
    avatar: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastMessage: 'Happy birthday!',
    lastMessageTime: new Date(Date.now() - 5 * 86400000)
  },
  {
    id: 'user7',
    name: 'David Wilson',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastMessage: 'Are you available for a call?',
    lastMessageTime: new Date(Date.now() - 7 * 86400000)
  }
];

const createMessages = (userId, count) => {
  const messages = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const isMe = i % 2 === 1;
    const hoursAgo = count - i;
    
    messages.push({
      id: `msg-${userId}-${i}`,
      sender: isMe ? 'me' : userId,
      content: getMessageContent(i),
      timestamp: new Date(now.getTime() - hoursAgo * 15 * 60000),
      status: isMe ? (i < count - 2 ? 'read' : 'delivered') : 'received'
    });
  }
  
  return messages;
};

const getMessageContent = (index) => {
  const messages = [
    "Hey, how's it going?",
    "Pretty good, thanks for asking! How about you?",
    "I'm doing well. Just finishing up some work.",
    "Nice! Any plans for the weekend?",
    "Thinking of going hiking, weather permitting.",
    "That sounds amazing! Where are you planning to go?",
    "Probably Mount Rainier. The trails should be nice this time of year.",
    "I've heard it's beautiful there. Take some pictures!",
    "Will do! Would you like to join?",
    "I'd love to, but I have a family event. Maybe next time?",
    "For sure! I'll keep you posted on the next trip.",
    "Perfect. Let me know how it goes!",
    "Will do. Talk to you later!",
    "Sounds good. Have a great time!",
    "Thanks! Have a good weekend too."
  ];
  
  return messages[index % messages.length];
};

export const messages = {
  user1: createMessages('user1', 15),
  user2: createMessages('user2', 8),
  user3: createMessages('user3', 12),
  user4: createMessages('user4', 6),
  user5: createMessages('user5', 9),
  user6: createMessages('user6', 4),
  user7: createMessages('user7', 7)
};