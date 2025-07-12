import { useState, useEffect } from 'react';
import { useApiRequest } from './useApiRequest';
import { BASE_URL } from '../src/constants/config';

export function useChatMessages(chatId, userId) {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { makeRequest } = useApiRequest();

    useEffect(() => {
        const fetchMessages = async () => {
            if (!chatId) {
                return;
            }
            try {
                setIsLoading(true);
                setError(null);
                console.log('Fetching messages from:', `${BASE_URL}messages?chat_id=${chatId}`);
                const result = await makeRequest({
                    url: `${BASE_URL}messages?chat_id=${chatId}`,
                    method: 'GET'
                });

                if (result.success) {
                    if (Array.isArray(result.data)) {
                        try {
                            console.log('Raw messages from API:', result.data);

                            const formattedMessages = result.data.map(msg => {
                                const senderId = msg.sender_id?.toString();
                                const receiverId = msg.receiver_id?.toString();

                                return {
                                    id: msg.message_id?.toString() || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                                    sender: senderId,
                                    receiver: receiverId,
                                    content: msg.content,
                                    timestamp: msg.created_at ? new Date(msg.created_at) : new Date(),
                                    status: 'read'
                                };
                            });
                            const sortedMessages = formattedMessages.sort((a, b) =>
                                new Date(a.timestamp) - new Date(b.timestamp)
                            );

                            console.log('Messages after formatting and sorting:', sortedMessages);
                            console.log('Current user ID for comparison:', userId);

                            setMessages(sortedMessages);
                        } catch (formatErr) {
                            console.error('Error formatting messages:', formatErr);
                            setError('Error processing message data');
                            setMessages([]);
                        }
                    } else {
                        setMessages([]);
                    }
                } else if (result.status === 404) {
                    // This is not a true error, just no messages yet
                    console.log('No messages found for this chat');
                    setMessages([]);
                } else if (result.error && result.error.includes('non-JSON response')) {
                    console.error('Server returned HTML instead of JSON');
                    setError('The messages API returned HTML instead of JSON. The server might be misconfigured.');
                    setMessages([]);
                } else {
                    setError(result.error || 'Failed to fetch messages');
                }
            } catch (err) {
                console.error('Error fetching messages:', err);

                if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
                    setError('Network error. Please check your connection.');
                } else if (err.message?.includes('Unexpected token') || err.message?.includes('JSON')) {
                    setError('The server returned an invalid response. Try refreshing the page.');
                    console.error('JSON parse error details:', err);
                } else {
                    setError(err.message || 'An error occurred while fetching messages');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, [chatId, makeRequest]);

    return { messages, isLoading, error, setMessages };
}