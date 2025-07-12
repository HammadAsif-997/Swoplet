import { useState, useEffect } from 'react';
import { useApiRequest } from './useApiRequest';
import { BASE_URL, userId } from '../src/constants/config';

export function useContactData() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { makeRequest } = useApiRequest();

  useEffect(() => {
    const fetchContacts = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        // Log the URL for debugging
        console.log('Fetching contacts from:', `${BASE_URL}chats?user_id=${userId}`);
        const result = await makeRequest({
          url: `${BASE_URL}chats?user_id=${userId}`,
          method: 'GET'
        });

        if (result.success) {
          if (Array.isArray(result.data) && result.data.length > 0) {
            console.log('Raw contacts data:', result.data);

            const formattedContacts = result.data.map(chat => {
              // Determine if current user is the product owner or the other person
              const isOwner = chat.owner?.id?.toString() === userId.toString();
              const contactPerson = isOwner ? chat.otherPerson : chat.owner;

              // Save original data as well for message sending
              return {
                id: chat.chat_id?.toString() || `temp-${Date.now()}`,
                name: contactPerson?.username || 'Unknown User',
                userId: contactPerson?.id?.toString(),
                email: contactPerson?.email,
                lastMessage: chat.lastMessage?.content || '',
                lastMessageTime: chat.lastMessage?.created_at || chat.created_at,
                productId: chat.product?.product_id?.toString() || chat.product?.id?.toString(),
                productName: chat.product?.name || chat.product?.title,
                // Store original data for message sending
                owner: chat.owner,
                otherPerson: chat.otherPerson,
                product: chat.product
              };
            });

            console.log('Formatted contacts:', formattedContacts);
            setContacts(formattedContacts);
          } else {
            // Successfully received empty array - user has no conversations yet
            setContacts([]);
          }
        } else if (result.status === 404) {
          // Handle 404 gracefully - it's not really an error
          console.log('No conversations found for this user yet');
          setContacts([]);
        } else {
          setError(result.error || 'Failed to fetch contacts');
        }
      } catch (err) {
        console.error('Error fetching contacts:', err);

        if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
          setError('Network error. Please check your connection.');
        } else if (err.message?.includes('Unexpected token')) {
          setError('Server returned an invalid response.');
        } else {
          setError(err.message || 'An error occurred while fetching contacts');
        }

        setContacts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [makeRequest]);

  return { contacts, isLoading, error };
}
