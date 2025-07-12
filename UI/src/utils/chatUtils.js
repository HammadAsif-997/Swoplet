import { io } from 'socket.io-client'
import { SOCKET_URL, BASE_URL } from '../constants/config'

/**
 * Checks if a chat already exists between the current user and seller for a specific product
 * @param {number} currentUserId - The current user's ID
 * @param {number} sellerId - The seller's ID  
 * @param {number} productId - The product ID
 * @returns {Promise<boolean>} - Promise that resolves to true if chat exists
 */
export const checkChatExists = async (currentUserId, sellerId, productId) => {
  try {
    const response = await fetch(`${BASE_URL}chats?user_id=${currentUserId}`)
    const data = await response.json()
    
    if (data.status === 200 && data.data) {
      // Check if any existing chat matches this product and involves both users
      const existingChat = data.data.find(chat => 
        chat.product.id === productId &&
        ((chat.owner.id === sellerId && chat.otherPerson.id === currentUserId) ||
         (chat.owner.id === currentUserId && chat.otherPerson.id === sellerId))
      )
      return !!existingChat
    }
    return false
  } catch (error) {
    console.error('Error checking chat existence:', error)
    return false
  }
}

/**
 * Initiates a chat with a seller by sending an initial message (only if chat doesn't exist)
 * @param {number} currentUserId - The current user's ID
 * @param {number} sellerId - The seller's ID
 * @param {number} productId - The product ID
 * @param {string} initialMessage - The initial message to send
 * @returns {Promise<{chatExists: boolean}>} - Promise that resolves with chat existence info
 */
export const initiateChatWithSeller = async (currentUserId, sellerId, productId, initialMessage = "Hi, I'm interested in this product.") => {
  // First check if chat already exists
  const chatExists = await checkChatExists(currentUserId, sellerId, productId)
  
  if (chatExists) {
    console.log('Chat already exists, skipping message send')
    return { chatExists: true }
  }

  // Try socket first, then fallback to HTTP
  return new Promise((resolve) => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 1,
      timeout: 3000
    })

    const sendViaHttp = async () => {
      try {
        await fetch(`${BASE_URL}messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender_id: currentUserId,
            receiver_id: sellerId,
            product_id: productId,
            content: initialMessage,
          }),
        })
        resolve({ chatExists: false })
      } catch (error) {
        console.error('HTTP fallback failed:', error)
        resolve({ chatExists: false })
      }
    }

    socket.on('connect', () => {
      console.log('✅ Connected to socket for chat initiation:', socket.id)
      socket.emit('join', { user_id: currentUserId })

      const messageData = {
        sender_id: currentUserId,
        receiver_id: sellerId,
        product_id: productId,
        content: initialMessage,
      }

      socket.emit('send_message', messageData)
      
      setTimeout(() => {
        socket.disconnect()
        resolve({ chatExists: false })
      }, 1000)
    })

    socket.on('connect_error', () => {
      console.log('Socket failed, using HTTP fallback')
      socket.disconnect()
      sendViaHttp()
    })

    // Fallback timeout
    setTimeout(() => {
      if (!socket.connected) {
        socket.disconnect()
        sendViaHttp()
      }
    }, 3000)
  })
}
