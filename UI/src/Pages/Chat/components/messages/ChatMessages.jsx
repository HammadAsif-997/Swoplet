// src/components/ChatMessages.jsx
import React, { useRef, useEffect } from 'react'

const ChatMessages = ({
    messages,
    loading,
    error,
    newMsg,
    onChangeNewMsg,
    onSend,
    currentUserId,
}) => {
    const containerRef = useRef(null)
    const bottomRef = useRef(null)



    if (loading) return <div className="p-4">Loading messages…</div>
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>

    return (
        <div className="flex flex-col h-full">            {/* Messages list */}
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col"
            >{messages.map((m) => {
                // Ensure proper type comparison for message alignment
                const isCurrentUser = parseInt(m.sender_id) === parseInt(currentUserId);

                return (
                    <div
                        key={m.message_id || `${m.sender_id}-${m.created_at}-${Math.random()}`}
                        className={`max-w-xs px-4 py-2 rounded-lg break-words ${isCurrentUser
                            ? 'self-end bg-blue-500 text-white'
                            : 'self-start bg-gray-200 text-gray-800'
                            }`}
                    >
                        {m.content}
                    </div>
                );
            })}
                {/* dummy div to scroll into view */}
                <div ref={bottomRef} />
            </div>

            {/* Input & Send – always visible */}
            <div className="border-t p-4 flex-shrink-0">
                <div className="flex">
                    <input
                        type="text"
                        className="flex-1 border rounded-l-lg p-2 focus:outline-none"
                        placeholder="Type a message…"
                        value={newMsg}
                        onChange={(e) => onChangeNewMsg(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSend()}
                    />
                    <button
                        onClick={onSend}
                        className="px-4 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatMessages
