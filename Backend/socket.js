const socketIO = require('socket.io');
const chatService = require('./utils/chatService');

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log('✅ Socket connected:', socket.id);
    socket.on('join', (data) => {
      const userId = data.user_id;
      if (!userId) return;
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} joined via socket ${socket.id}`);
    });


    socket.on('send_message', async (data) => {
      console.log("send called")
      const { sender_id, receiver_id, product_id, content } = data;
      console.log("send called data ",data)

      try {
        const { chat_id, message } = await chatService.saveMessageAndChat({
          sender_id,
          receiver_id,
          product_id,
          content
        });

        // Emit to receiver (if online)
        const receiverSocket = onlineUsers.get(receiver_id);
        if (receiverSocket) {
          io.to(receiverSocket).emit('receive_message', {
            chat_id,
            sender_id,
            receiver_id,
            content: message.content,
            created_at: message.created_at
          });
        }

        // Emit to sender as well
        const senderSocket = onlineUsers.get(sender_id);
        if (senderSocket) {
          io.to(senderSocket).emit('receive_message', {
            chat_id,
            sender_id,
            receiver_id,
            content: message.content,
            created_at: message.created_at
          });
        }
      } catch (error) {
        console.error('❌ Error handling send_message:', error.message);
      }
    });

    socket.on('disconnect', () => {
      for (const [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });
};

module.exports = setupSocket;
