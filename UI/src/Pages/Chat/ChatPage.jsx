import React, { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { BASE_URL, SOCKET_URL } from "../../constants/config";
import { useApiRequest } from "../../../hooks/useApiRequest";
import ChatList from "./components/Chat/ChatList";
import ChatMessages from "./components/messages/ChatMessages";
import { useAuthRedirect } from "../../../hooks/useAuthRedirect";

const normalize = (payload) =>
  Array.isArray(payload) ? payload : payload?.data ?? [];

export default function ChatPage() {
  // Get user ID from localStorage
  const userId = localStorage.getItem('userId');
  const currentUserId = parseInt(userId) || 1;
  useAuthRedirect();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const messagesUrl = activeChat
    ? `${BASE_URL}messages?chat_id=${activeChat.chat_id}`
    : null;
  const {
    data: rawChats,
    loading: loadingChats,
    error: errorChats,
    makeRequest: fetchChats,
  } = useApiRequest(`${BASE_URL}chats?user_id=${currentUserId}`);
  const {
    data: rawMessages,
    loading: loadingMessages,
    error: errorMessages,
    makeRequest: fetchMessages,
  } = useApiRequest(messagesUrl); // connect web socket
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 3,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to socket:", newSocket.id);
      newSocket.emit("join", { user_id: currentUserId });
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from socket");
    });

    newSocket.on("receive_message", (msg) => {
      if (msg.chat_id === activeChat?.chat_id) {
        setMessages((prev) => [...prev, msg]);
      }

      // Refresh chat list to show new chat or update last message
      if (fetchChats) {
        fetchChats()
          .then(({ data }) => {
            const normalizedChats = normalize(data);
            setChats(normalizedChats);

            // If this is a new chat and no active chat is selected, select it
            if (!activeChat && normalizedChats.length > 0) {
              const newChat = normalizedChats.find(
                (chat) => chat.chat_id === msg.chat_id
              );
              if (newChat) {
                setActiveChat(newChat);
              }
            }
          })
          .catch((error) => {
            console.error("Error refreshing chats:", error);
          });
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUserId, activeChat?.chat_id, fetchChats]);

  //  fetch chat
  useEffect(() => {
    if (fetchChats) {
      fetchChats()
        .then(({ data }) => {
          const normalizedChats = normalize(data);
          setChats(normalizedChats);

          // Auto-select the first chat if none is selected and chats exist
          if (!activeChat && normalizedChats.length > 0) {
            setActiveChat(normalizedChats[0]);
          }
        })
        .catch((error) => {
          console.error("Error fetching chats:", error);
        });
    }
  }, []);

  useEffect(() => {
    if (!activeChat) {
      setMessages([]);
      return;
    }

    if (fetchMessages) {
      fetchMessages()
        .then(({ data }) => {
          setMessages(normalize(data));
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }
  }, [activeChat?.chat_id]);
  const sendMessage = useCallback(() => {
    if (!activeChat || !newMessage.trim() || !socket) return;

    // Ensure proper number comparison
    const ownerIdNum = parseInt(activeChat.owner.id);

    const receiverId =
      ownerIdNum === currentUserId
        ? activeChat.otherPerson.id
        : activeChat.owner.id;

    const messageData = {
      sender_id: currentUserId,
      receiver_id: receiverId,
      product_id: activeChat.product?.id,
      content: newMessage.trim(),
    };

    socket.emit("send_message", messageData);
    setNewMessage("");
  }, [activeChat, newMessage, currentUserId, socket]);

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-1/3 border-r overflow-y-auto">
        <ChatList
          chats={chats}
          loading={loadingChats}
          error={errorChats}
          selectedChatId={activeChat?.chat_id}
          onSelectChat={setActiveChat}
          currentUserId={currentUserId}
        />
      </aside>

      <main className="w-2/3 flex flex-col h-full">
        {activeChat ? (
          <ChatMessages
            messages={messages}
            loading={loadingMessages}
            error={errorMessages}
            newMsg={newMessage}
            onChangeNewMsg={setNewMessage}
            onSend={sendMessage}
            sending={false}
            sendError={null}
            currentUserId={currentUserId}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to view messages
          </div>
        )}
      </main>
    </div>
  );
}
