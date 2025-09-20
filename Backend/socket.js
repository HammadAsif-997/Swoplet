const socketIO = require('socket.io');
const chatService = require('./utils/chatService');

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Optimized user tracking with rooms
  const onlineUsers = new Map(); // userId -> socketId
  const socketUsers = new Map(); // socketId -> userId

  io.on('connection', (socket) => {
    console.log('✅ Socket connected:', socket.id);
    
    socket.on('join', (data) => {
      const userId = data.user_id;
      if (!userId) return;
      
      // Improved user tracking
      const previousSocketId = onlineUsers.get(userId);
      if (previousSocketId && previousSocketId !== socket.id) {
        // User connected from another device/tab, disconnect previous
        socketUsers.delete(previousSocketId);
      }
      
      onlineUsers.set(userId, socket.id);
      socketUsers.set(socket.id, userId);

      // Join user-specific room for targeted messaging
      socket.join(`user:${userId}`);
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

        const messageData = {
          chat_id,
          sender_id,
          receiver_id,
          content: message.content,
          created_at: message.created_at
        };

        // Emit to receiver using room (more scalable)
        io.to(`user:${receiver_id}`).emit('receive_message', messageData);

        // Emit unread count update to receiver
        io.to(`user:${receiver_id}`).emit('unread_count_update', {
          user_id: receiver_id,
          chat_id,
          increment: 1
        });

        // Emit to sender using room
        io.to(`user:${sender_id}`).emit('receive_message', messageData);

      } catch (error) {
        console.error('❌ Error handling send_message:', error.message);
        socket.emit('message_error', { error: error.message });
      }
    });

    socket.on('mark_messages_read', (data) => {
      const { user_id, chat_id } = data;
      if (!user_id || !chat_id) return;

      io.to(`user:${user_id}`).emit('unread_count_update', {
        user_id,
        chat_id,
        reset_chat: true
      });
    });

    socket.on('disconnect', () => {
      const userId = socketUsers.get(socket.id);
      if (userId) {
        // Only remove if this socket belongs to this user (handles multiple sessions)
        if (onlineUsers.get(userId) === socket.id) {
          onlineUsers.delete(userId);
        }
        socketUsers.delete(socket.id);
        console.log(`User ${userId} disconnected`);
      }
    });
  });
};

module.exports = setupSocket;
