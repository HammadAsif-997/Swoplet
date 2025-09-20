import React, { useEffect } from 'react';
import { ContactProvider, useContacts } from '../../context/ContactContext';
import ChatPanel from '../../components/Chat/ChatPanel';
import EmptyState from '../../components/Chat/EmptyState';

// Contact List Component
const ContactList = () => {
    const { filteredContacts, activeContactId, setActiveContactId, searchTerm, setSearchTerm, isLoading, error } = useContacts();
    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Search Bar */}
            <div className="p-4 flex-shrink-0">
                <input
                    type="text"
                    placeholder="Search contact"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Contact List */}
            <div className="overflow-y-auto flex-1">
                {isLoading ? (
                    <div className="p-4 text-center">
                        <div className="animate-pulse">
                            <div className="h-12 bg-gray-200 mb-3 rounded"></div>
                            <div className="h-12 bg-gray-200 mb-3 rounded"></div>
                            <div className="h-12 bg-gray-200 rounded"></div>
                        </div>
                    </div>) : error ? (
                        <div className="p-4 text-center text-red-500">
                            <p className="font-medium">Error loading contacts</p>
                            <p className="text-sm mt-1">{error}</p>
                            <button
                                className="mt-3 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                onClick={() => window.location.reload()}
                            >
                                Retry
                            </button>
                        </div>
                    ) : filteredContacts.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="mb-3 text-blue-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-600">No conversations yet</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Start a new conversation by browsing the marketplace and contacting a seller
                            </p>
                        </div>
                    ) : (
                    filteredContacts.map(contact => (
                        <div
                            key={contact.id}
                            className={`flex items-center p-4 hover:bg-gray-100 cursor-pointer ${activeContactId === contact.id ? 'bg-blue-50' : ''
                                }`}
                            onClick={() => setActiveContactId(contact.id)}
                        >
                            <div className="w-8 h-8 rounded-full mr-3 overflow-hidden">
                                <img 
                                    src={contact.avatar} 
                                    alt={contact.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Fallback to initials if image fails to load
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold" style={{display: 'none'}}>
                                    {contact.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between">
                                    <h3 className="font-medium truncate">{contact.name}</h3>
                                    {contact.lastMessageTime && (
                                        <span className="text-xs text-gray-500">
                                            {contact.lastMessageTime.toString().includes('T')
                                                ? new Date(contact.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : contact.lastMessageTime}
                                        </span>
                                    )}
                                </div>
                                {contact.lastMessage && (
                                    <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// Chat with Contacts component that uses the context
const ChatWithContacts = () => {
    const { activeContactId, contacts } = useContacts();
    useEffect(() => {
        const activeChatInfo = localStorage.getItem('activeChatInfo');
        if (activeChatInfo) {
            const selectedSellerJson = localStorage.getItem('selectedSeller');
            if (selectedSellerJson) {
                localStorage.removeItem('selectedSeller');
            }
        }
    }, []); return (
        <div className="flex w-full h-full overflow-hidden">
            {/* Left sidebar: Contact List */}
            <div className="w-1/4 min-w-[250px] border-r bg-white overflow-hidden">
                <ContactList />
            </div>

            {/* Right panel: Chat area */}
            <div className="flex-1 bg-white overflow-hidden">
                {activeContactId ? <ChatPanel /> : <EmptyState />}
            </div>
        </div>
    );
};

// Main Chat Page
const ChatPageOld = () => {
    return (
        <ContactProvider>
            <div className="flex flex-col h-[calc(100vh-248px)] bg-white">
                <h1 className="text-2xl font-bold p-4 border-b">Messages</h1>
                <div className="flex flex-1 overflow-hidden">
                    <ChatWithContacts />
                </div>
            </div>
        </ContactProvider>
    );
};

export default ChatPageOld;
