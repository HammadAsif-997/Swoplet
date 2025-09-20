const { query, body } = require("express-validator");

// GET /messages
const getChatMessagesValidation = [
  query("chat_id").isInt({ min: 1 }).withMessage("Valid chat ID is required"),
  query("user_id").optional().isInt({ min: 1 }).withMessage("Valid user ID is required"),
];

// GET /chats
const getUserChatsValidation = [
  query("user_id").isInt({ min: 1 }).withMessage("Valid user ID is required"),
];

const deleteChatValidation = [
  body("chat_id").isInt({ min: 1 }).withMessage("Valid chat ID is required"),
  body("user_id").isInt({ min: 1 }).withMessage("Valid user ID is required"),
];

const getUnreadCountValidation = [
  query("user_id").isInt({ min: 1 }).withMessage("Valid user ID is required"),
];

module.exports = {
  getChatMessagesValidation,
  getUserChatsValidation,
  deleteChatValidation,
  getUnreadCountValidation,
};
