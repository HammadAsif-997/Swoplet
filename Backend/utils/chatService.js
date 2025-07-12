const { chat, message, productlisting } = require('../models');

exports.saveMessageAndChat = async ({ sender_id, receiver_id, product_id, content }) => {
  const product = await productlisting.findByPk(product_id);
  if (!product) throw new Error('Product not found');

  const product_owner_id = product.created_by_id;
  const other_person_id = sender_id === product_owner_id ? receiver_id : sender_id;

  let chatRecord = await chat.findOne({
    where: { product_id, product_owner_id, other_person_id }
  });

  if (!chatRecord) {
    chatRecord = await chat.create({
      product_id,
      product_owner_id,
      other_person_id
    });
  }

  const newMessage = await message.create({
    chat_id: chatRecord.chat_id,
    sender_id,
    receiver_id,
    content
  });

  await chat.update(
    { last_message_id: newMessage.message_id },
    { where: { chat_id: chatRecord.chat_id } }
  );

  return {
    chat_id: chatRecord.chat_id,
    message: newMessage
  };
};
