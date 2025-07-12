const { Op } = require('sequelize');
const { chat, message, productlisting, mediafile, user, sequelize } = require('../models');


exports.getUserChats = async (req, res) => {
  try {
    const { user_id } = req.query;
    const deletionFilter = {
      [Op.or]: [
        {
          [Op.and]: [
            { product_owner_id: user_id },
            { owner_deleted: false }
          ]
        },
        {
          [Op.and]: [
            { other_person_id: user_id },
            { other_deleted: false }
          ]
        }
      ]
    };

    const chats = await chat.findAll({
      attributes: ['chat_id', 'created_at', 'product_owner_id', 'other_person_id'],
      where: deletionFilter,
      include: [
        {
          model: productlisting,
          as: 'product',
          include: [{
            model: mediafile,
            as: 'mediafiles',
            attributes: ['file_path'],
            where: { is_approved: true },
            required: false
          }]
        },
        {
          model: message,
          as: 'lastMessage',
          attributes: ['message_id', 'content', 'sender_id', 'receiver_id', 'created_at']
        },
        { model: user, as: 'owner', attributes: ['id', 'username', 'email', 'createdAt'] },
        { model: user, as: 'otherPerson', attributes: ['id', 'username', 'email', 'createdAt'] }
      ],
      order: [['chat_id', 'DESC']]
    });

    // attach a single image_url and strip out mediafiles array
    const result = chats.map(c => {
      const json = c.toJSON();
      const media = json.product.mediafiles || [];
      json.product.image_url = media.length ? media[0].file_path : null;
      delete json.product.mediafiles;
      return json;
    });

    return res.success('User chats fetched successfully', result, 200);
  } catch (err) {
    return res.error(err.message || 'Failed to fetch user chats', 500);
  }
};


exports.getChatMessages = async (req, res) => {
  try {
    const { chat_id } = req.query;

    const chatExists = await chat.findByPk(chat_id);
    if (!chatExists) {
      return res.success('No messages yet. Chat can be started.', [], 200);
    }

    const messages = await message.findAll({
      where: { chat_id },
      order: [['message_id', 'ASC']]
    });

    return res.success('Messages fetched successfully', messages, 200);
  } catch (err) {
    return res.error(err.message || 'Failed to fetch messages', 500);
  }
};


exports.deleteChat = async (req, res) => {
  try {
    const { chat_id, user_id } = req.body;
    if (!chat_id || !user_id) {
      return res.error('chat_id and user_id are required', 400);
    }

    const chatRecord = await chat.findByPk(chat_id);
    if (!chatRecord) {
      return res.error('Chat not found', 404);
    }


    // update deleted status
    let patch;
    if (chatRecord.product_owner_id === user_id) {
      patch = { owner_deleted: true };
    } else if (chatRecord.other_person_id === user_id) {
      patch = { other_deleted: true };
    } else {
      return res.error('User not part of this chat', 403);
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

    return res.success('Chat deleted for you', null, 200);
  } catch (err) {
    console.error('❌ Error deleting chat:', err);
    return res.error(err.message || 'Failed to delete chat', 500);
  }
};
