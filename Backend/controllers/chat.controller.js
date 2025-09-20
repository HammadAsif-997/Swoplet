const { Op } = require("sequelize");
const {
  chat,
  message,
  productlisting,
  mediafile,
  user,
  sequelize,
} = require("../models");

exports.getUserChats = async (req, res) => {
  try {
    const { user_id } = req.query;
    const deletionFilter = {
      [Op.or]: [
        {
          [Op.and]: [{ product_owner_id: user_id }, { owner_deleted: false }],
        },
        {
          [Op.and]: [{ other_person_id: user_id }, { other_deleted: false }],
        },
      ],
    };

    const chats = await chat.findAll({
      attributes: [
        "chat_id",
        "created_at",
        "product_owner_id",
        "other_person_id",
        [
          sequelize.literal(`(
            SELECT COUNT(*) 
            FROM messages 
            WHERE messages.chat_id = chat.chat_id 
            AND messages.receiver_id = ${parseInt(user_id)} 
            AND messages.is_read = false
          )`),
          'unread_count'
        ]
      ],
      where: deletionFilter,
      include: [
        {
          model: productlisting,
          as: "product",
          include: [
            {
              model: mediafile,
              as: "mediafiles",
              attributes: ["file_path"],
              required: false,
            },
          ],
        },
        {
          model: message,
          as: "lastMessage",
          attributes: [
            "message_id",
            "content",
            "sender_id",
            "receiver_id",
            "created_at",
          ],
        },
        {
          model: user,
          as: "owner",
          attributes: ["id", "username", "email", "image_url", "createdAt"],
        },
        {
          model: user,
          as: "otherPerson",
          attributes: ["id", "username", "email", "image_url", "createdAt"],
        },
      ],
      order: [["chat_id", "DESC"]],
    });

    // attach a single image_url and strip out mediafiles array
    const result = chats.map((c) => {
      const json = c.toJSON();
      const media = json.product.mediafiles || [];
      json.product.image_url = media.length ? media[0].file_path : null;
      delete json.product.mediafiles;
      
      json.unread_count = parseInt(json.unread_count) || 0;
      
      return json;
    });

    return res.success("User chats fetched successfully", result, 200);
  } catch (err) {
    return res.error(err.message || "Failed to fetch user chats", 500);
  }
};

exports.getChatMessages = async (req, res) => {
  try {
    const { chat_id, user_id } = req.query;

    const chatExists = await chat.findByPk(chat_id);
    if (!chatExists) {
      return res.success("No messages yet. Chat can be started.", [], 200);
    }

    const messages = await message.findAll({
      where: { chat_id },
      order: [["message_id", "ASC"]],
    });

    // Send response immediately, then mark as read asynchronously
    res.success("Messages fetched successfully", messages, 200);

    // Mark messages as read asynchronously (non-blocking)
    if (user_id) {
      setImmediate(async () => {
        try {
          await message.update(
            { is_read: true },
            { 
              where: { chat_id, receiver_id: user_id, is_read: false },
              logging: false // Disable SQL logging for faster execution
            }
          );
        } catch (error) {
          console.error('❌ Error marking messages as read:', error);
        }
      });
    }
  } catch (err) {
    return res.error(err.message || "Failed to fetch messages", 500);
  }
};

exports.deleteChat = async (req, res) => {
  try {
    const { chat_id, user_id } = req.body;
    if (!chat_id || !user_id) {
      return res.error("chat_id and user_id are required", 400);
    }

    const chatRecord = await chat.findByPk(chat_id);
    if (!chatRecord) {
      return res.error("Chat not found", 404);
    }

    // update deleted status
    let patch;
    if (chatRecord.product_owner_id === user_id) {
      patch = { owner_deleted: true };
    } else if (chatRecord.other_person_id === user_id) {
      patch = { other_deleted: true };
    } else {
      return res.error("User not part of this chat", 403);
    }
    await chat.update(patch, { where: { chat_id } });

    // delete chat and message if have to
    const updated = await chat.findByPk(chat_id);
    if (updated.owner_deleted && updated.other_deleted) {
      await sequelize.transaction(async (t) => {
        await message.destroy({ where: { chat_id }, transaction: t });
        await chat.destroy({ where: { chat_id }, transaction: t });
      });
    }

    return res.success("Chat deleted for you", null, 200);
  } catch (err) {
    console.error("❌ Error deleting chat:", err);
    return res.error(err.message || "Failed to delete chat", 500);
  }
};

exports.getUnreadMessagesCount = async (req, res) => {
  try {
    const { user_id } = req.query;

    //  Count total unread messages 
    const unreadCount = await message.count({
      where: { receiver_id: user_id, is_read: false },
    });

    return res.success(
      "Unread messages count fetched successfully",
      { count: unreadCount },
      200
    );
  } catch (err) {
    return res.error(
      err.message || "Failed to fetch unread messages count",
      500
    );
  }
};
