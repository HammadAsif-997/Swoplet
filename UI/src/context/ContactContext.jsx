import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { BASE_URL, SOCKET_URL, userId } from '../constants/config';
import { useApiRequest } from '../../hooks/useApiRequest';

const ContactContext = createContext(undefined);

const normalize = (payload) =>
  Array.isArray(payload) ? payload : payload?.data ?? []

// Transform backend chat data to match our UI structure
const transformChatToContact = (chat, currentUserId) => {
  const isOwner = chat.owner.id === currentUserId;
  const otherUser = isOwner ? chat.otherPerson : chat.owner;

  return {
    id: chat.chat_id.toString(),
    name: otherUser.username,
    avatar: otherUser.image_url || "https://www.shareicon.net/data/512x512/2016/05/24/770117_people_512x512.png",
    lastMessage: chat.lastMessage?.content || '',
    lastMessageTime: chat.lastMessage?.created_at ? new Date(chat.lastMessage.created_at) : new Date(),
    unreadCount: 0,
    // Store original chat data for socket operations
    _originalChat: chat
  };
};

// Transform backend message data to match our UI structure
const transformMessage = (message, currentUserId) => {
  return {
    id: message.message_id?.toString(),
    sender: message.sender_id === currentUserId ? 'me' : message.sender_id.toString(),
    content: message.content,
    timestamp: new Date(message.created_at),
    status: message.sender_id === currentUserId ? 'sent' : 'received'
  };
};

export const ContactProvider = ({ children }) => {
  const currentUserId = parseInt(userId) || 1;

  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeContactId, setActiveContactId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); const [socket, setSocket] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [pendingActiveChatInfo, setPendingActiveChatInfo] = useState(null);

  // Use ref to access current contacts without causing re-renders
  const contactsRef = useRef(contacts);
  contactsRef.current = contacts;

  // Check for pending chat activation on component mount
  useEffect(() => {
    const activeChatInfo = localStorage.getItem('activeChatInfo');
    if (activeChatInfo) {
      try {
        setPendingActiveChatInfo(JSON.parse(activeChatInfo));
      } catch (error) {
        console.error('Error parsing active chat info:', error);
        localStorage.removeItem('activeChatInfo');
      }
    }
  }, []);

  // Get active chat from contacts
  const activeChat = activeContactId
    ? contacts.find(c => c.id === activeContactId)?._originalChat
    : null;

  const messagesUrl = activeChat ? `${BASE_URL}messages?chat_id=${activeChat.chat_id}` : null;
  const { data: rawChats, loading: loadingChats, error: errorChats, makeRequest: fetchChats } = useApiRequest(`${BASE_URL}chats?user_id=${currentUserId}`);
  const { data: rawMessages, loading: loadingMessages, error: errorMessages, makeRequest: fetchMessages } = useApiRequest(messagesUrl);  // Connect WebSocket
  useEffect(() => {
    if (!currentUserId) return;

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      timeout: 20000
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Connected to socket:', newSocket.id);
      newSocket.emit('join', { user_id: currentUserId });
    }); newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from socket');
    });

    // Handle message sent confirmation
    newSocket.on('message_sent', (sentMessage) => {
      console.log('Message sent confirmation:', sentMessage);

      // Update the optimistic message with the real message data
      if (sentMessage.chat_id === activeChat?.chat_id) {
        setMessages(prev => {
          const currentMessages = prev[activeContactId] || [];
          const updatedMessages = currentMessages.map(msg => {
            // Find the optimistic message and replace it with the real one
            if (msg.id.startsWith('temp-') && msg.content === sentMessage.content && msg.sender === 'me') {
              return transformMessage(sentMessage, currentUserId);
            }
            return msg;
          });
          return {
            ...prev,
            [activeContactId]: updatedMessages
          };
        });
      }
    });

    newSocket.on('receive_message', (msg) => {
      console.log('Received message:', msg);

      // Skip if this is our own message (to prevent duplicate display)
      if (msg.sender_id === currentUserId) {
        return;
      }

      // Find if we have this chat in our current contacts using ref
      const existingContact = contactsRef.current.find(c => c._originalChat?.chat_id === msg.chat_id);

      if (msg.chat_id === activeChat?.chat_id) {
        // Message for currently active chat
        const transformedMessage = transformMessage(msg, currentUserId);
        setMessages((prev) => ({
          ...prev,
          [activeContactId]: [...(prev[activeContactId] || []), transformedMessage]
        }));

        // Update contact's last message
        setContacts(prev =>
          prev.map(contact =>
            contact.id === activeContactId
              ? {
                ...contact,
                lastMessage: msg.content,
                lastMessageTime: new Date(msg.created_at || Date.now())
              }
              : contact
          )
        );
      } else if (existingContact) {
        // Message for an existing chat that's not currently active
        // Update the last message for that contact
        setContacts(prev =>
          prev.map(contact =>
            contact.id === existingContact.id
              ? {
                ...contact,
                lastMessage: msg.content,
                lastMessageTime: new Date(msg.created_at || Date.now())
              }
              : contact
          )
        );
      } else {
        // This is a new chat - refresh the chats list to include it
        fetchChats().then(({ data }) => {
          const chats = normalize(data);
          const transformedContacts = chats.map(chat => transformChatToContact(chat, currentUserId));
          setContacts(transformedContacts);

          // Check if we should auto-select this new chat
          const activeChatInfo = pendingActiveChatInfo || (() => {
            const stored = localStorage.getItem('activeChatInfo');
            return stored ? JSON.parse(stored) : null;
          })();

          if (activeChatInfo) {
            try {
              const { sellerId, productId } = activeChatInfo;

              // Find the chat that matches this seller and product
              const targetChat = chats.find(chat => {
                const otherUserId = chat.owner.id === currentUserId ? chat.otherPerson.id : chat.owner.id;
                return otherUserId === sellerId && chat.product?.id === productId;
              });

              if (targetChat && targetChat.chat_id === msg.chat_id) {
                const targetContactId = targetChat.chat_id.toString();
                setActiveContactId(targetContactId);
                // Clear the stored info and pending state since we found and activated the chat
                localStorage.removeItem('activeChatInfo');
                setPendingActiveChatInfo(null);
              }
            } catch (error) {
              console.error('Error parsing active chat info:', error);
              localStorage.removeItem('activeChatInfo');
              setPendingActiveChatInfo(null);
            }
          }
        }).catch(error => {
          console.error('Error refreshing chats:', error);
        });
      }
    }); return () => {
      newSocket.disconnect();
    };
  }, [currentUserId, activeChat?.chat_id, activeContactId]);// Fetch chats
  useEffect(() => {
    if (!currentUserId) return;

    fetchChats().then(({ data }) => {
      const chats = normalize(data);
      const transformedContacts = chats.map(chat => transformChatToContact(chat, currentUserId));
      setContacts(transformedContacts);

      // Check if there's a specific chat to activate (either from localStorage or pending state)
      const activeChatInfo = pendingActiveChatInfo || (() => {
        const stored = localStorage.getItem('activeChatInfo');
        return stored ? JSON.parse(stored) : null;
      })();

      if (activeChatInfo) {
        try {
          const { sellerId, productId } = activeChatInfo;

          // Find the chat that matches this seller and product
          const targetChat = chats.find(chat => {
            const otherUserId = chat.owner.id === currentUserId ? chat.otherPerson.id : chat.owner.id;
            return otherUserId === sellerId && chat.product?.id === productId;
          });

          if (targetChat) {
            const targetContactId = targetChat.chat_id.toString();
            setActiveContactId(targetContactId);

            // Clear the stored info and pending state
            localStorage.removeItem('activeChatInfo');
            setPendingActiveChatInfo(null);
          }
        } catch (error) {
          console.error('Error parsing active chat info:', error);
          localStorage.removeItem('activeChatInfo');
          setPendingActiveChatInfo(null);
        }
      }
    }).catch(error => {
      console.error('Error fetching chats:', error);
    });
  }, [fetchChats, currentUserId, pendingActiveChatInfo]);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (!activeChat) {
      return;
    }

    fetchMessages().then(({ data }) => {
      const msgs = normalize(data);
      const transformedMessages = msgs.map(msg => transformMessage(msg, currentUserId));
      setMessages(prev => ({
        ...prev,
        [activeContactId]: transformedMessages
      }));
    });
  }, [activeChat, fetchMessages, activeContactId, currentUserId]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
  ); 
  const sendMessage = useCallback((content) => {
    if (!activeChat || !content.trim() || !socket) return;

    const receiverId = activeChat.owner.id === currentUserId ? activeChat.otherPerson.id : activeChat.owner.id;

    const messageData = {
      sender_id: currentUserId,
      receiver_id: receiverId,
      product_id: activeChat.product?.id,
      content: content.trim(),
    };

    socket.emit('send_message', messageData);

    // Optimistically add message to UI
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      sender: 'me',
      content: content.trim(),
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), optimisticMessage]
    }));

    // Update contact's last message
    setContacts(prev =>
      prev.map(contact =>
        contact.id === activeContactId
          ? {
            ...contact,
            lastMessage: content.trim(),
            lastMessageTime: new Date()
          }
          : contact
      )
    );
  }, [activeChat, currentUserId, socket, activeContactId]);

  return (
    <ContactContext.Provider
      value={{
        contacts,
        messages,
        activeContactId,
        setActiveContactId,
        searchTerm,
        setSearchTerm,
        filteredContacts,
        sendMessage,
        loading: loadingChats,
        error: errorChats
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
};
