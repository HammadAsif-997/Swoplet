import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { io } from 'socket.io-client';
import { BASE_URL, SOCKET_URL } from '../constants/config';
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
    unreadCount: chat.unread_count || 0, // Include unread count from backend
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
  // Get user ID from localStorage
  const userId = localStorage.getItem('userId');
  const currentUserId = userId && !isNaN(parseInt(userId)) ? parseInt(userId) : null;
  if (currentUserId === null) {
    throw new Error('User is not authenticated: userId missing or invalid in localStorage');
  }

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

  const messagesUrl = activeChat ? `${BASE_URL}messages?chat_id=${activeChat.chat_id}&user_id=${currentUserId}` : null;
  const { data: rawChats, loading: loadingChats, error: errorChats, makeRequest: fetchChats } = useApiRequest(`${BASE_URL}chats?user_id=${currentUserId}`);
  const { data: rawMessages, loading: loadingMessages, error: errorMessages, makeRequest: fetchMessages } = useApiRequest(messagesUrl);  // Connect WebSocket
  useEffect(() => {
    if (!currentUserId) return;

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      timeout: 20000,
      // Add connection state management
      autoConnect: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Connected to socket:', newSocket.id);
      newSocket.emit('join', { user_id: currentUserId });
    });

    // Enhanced connection error handling
    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from socket:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected, reconnect manually
        newSocket.connect();
      }
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected to socket after', attemptNumber, 'attempts');
      // Re-join user room after reconnection
      newSocket.emit('join', { user_id: currentUserId });
    });

    // Handle message errors
    newSocket.on('message_error', (error) => {
      console.error('❌ Message error:', error);
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
        // Message for currently active chat - don't increment unread count
        const transformedMessage = transformMessage(msg, currentUserId);
        setMessages((prev) => ({
          ...prev,
          [activeContactId]: [...(prev[activeContactId] || []), transformedMessage]
        }));

        // Update contact's last message without incrementing unread count (since chat is active)
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
                lastMessageTime: new Date(msg.created_at || Date.now()),
                unreadCount: (contact.unreadCount || 0) + 1 // Increment unread count safely
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
    });

    // Handle unread count updates
    newSocket.on('unread_count_update', (data) => {
      console.log('Unread count update:', data);
      const { chat_id, increment, reset_chat } = data;

      setContacts(prev => 
        prev.map(contact => {
          if (contact._originalChat?.chat_id === chat_id) {
            if (reset_chat) {
              return { ...contact, unreadCount: 0 };
            } else if (increment) {
              // Ensure unreadCount is always a number and never negative
              const currentCount = contact.unreadCount || 0;
              return { ...contact, unreadCount: Math.max(0, currentCount + increment) };
            }
          }
          return contact;
        })
      );
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

    // INSTANTLY clear unread count for immediate UI feedback
    setContacts(prev =>
      prev.map(contact =>
        contact.id === activeContactId
          ? { ...contact, unreadCount: 0 }
          : contact
      )
    );

    fetchMessages().then(({ data }) => {
      const msgs = normalize(data);
      const transformedMessages = msgs.map(msg => transformMessage(msg, currentUserId));
      setMessages(prev => ({
        ...prev,
        [activeContactId]: transformedMessages
      }));

      // Mark messages as read via socket (non-blocking)
      if (socket) {
        socket.emit('mark_messages_read', {
          user_id: currentUserId,
          chat_id: activeChat.chat_id
        });
      }
    });
  }, [activeChat, fetchMessages, activeContactId, currentUserId, socket]);

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

  // Memoize filtered contacts to prevent unnecessary recalculations
  const filteredContacts = useMemo(() => 
    contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase())
    ), [contacts, searchTerm]
  );

  // Memoize total unread count
  const totalUnreadCount = useMemo(() => 
    contacts.reduce((sum, contact) => sum + (contact.unreadCount || 0), 0),
    [contacts]
  );

  // ✅ Enhanced setActiveContactId with instant unread clearing
  const setActiveContactIdWithClear = useCallback((contactId) => {
    // Instantly clear unread count for immediate visual feedback
    if (contactId) {
      setContacts(prev =>
        prev.map(contact =>
          contact.id === contactId
            ? { ...contact, unreadCount: 0 }
            : contact
        )
      );
    }
    setActiveContactId(contactId);
  }, []);

  return (
    <ContactContext.Provider
      value={{
        contacts,
        messages,
        activeContactId,
        setActiveContactId: setActiveContactIdWithClear, // ✅ Use enhanced version
        searchTerm,
        setSearchTerm,
        filteredContacts,
        sendMessage,
        loading: loadingChats,
        error: errorChats,
        socket, // Expose socket for Header component
        totalUnreadCount // Use memoized total unread count
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
