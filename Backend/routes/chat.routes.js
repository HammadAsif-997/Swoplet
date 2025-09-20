const express = require("express");
const router = express.Router();
const controller = require("../controllers/chat.controller");
const validateRequest = require("../middleware/validateRequest");
const {
  getChatMessagesValidation,
  getUserChatsValidation,
  deleteChatValidation,
  getUnreadCountValidation,
} = require("../validator/chat.validator");

// Routes
router.get(
  "/messages",
  getChatMessagesValidation,
  validateRequest,
  controller.getChatMessages
);
router.get(
  "/chats",
  getUserChatsValidation,
  validateRequest,
  controller.getUserChats
);
router.get(
  "/messages/unread-count",
  getUnreadCountValidation,
  validateRequest,
  controller.getUnreadMessagesCount
);

router.delete(
  "/chats",
  deleteChatValidation,
  validateRequest,
  controller.deleteChat
);

module.exports = router;
