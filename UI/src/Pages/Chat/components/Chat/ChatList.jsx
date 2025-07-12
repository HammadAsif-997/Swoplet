// src/components/ChatList.jsx
import React from 'react'
import ChatItem from './ChatItem'

const ChatList = ({
    chats,
    loading,
    error,
    selectedChatId,
    onSelectChat,
    currentUserId,
}) => {
    if (loading) return <div className="p-4">Loading chats…</div>
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>
    if (chats.length === 0)
        return <div className="p-4 text-gray-500">No chats found</div>

    return (
        <div>
            {chats.map((chat) => (
                <ChatItem
                    key={chat.chat_id}
                    chat={chat}
                    currentUserId={currentUserId}
                    isSelected={chat.chat_id === selectedChatId}
                    onSelect={() => onSelectChat(chat)}
                />
            ))}
        </div>
    )
}

export default ChatList
