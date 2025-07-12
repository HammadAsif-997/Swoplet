module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    message_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    chat_id: { type: DataTypes.INTEGER, allowNull: false },
    sender_id: { type: DataTypes.INTEGER, allowNull: false },
    receiver_id: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    timestamps: false,
    tableName: 'messages'
  });

  Message.associate = (models) => {
    Message.belongsTo(models.chat, { foreignKey: 'chat_id', as: 'chat' });
    Message.belongsTo(models.user, { foreignKey: 'sender_id', as: 'sender' });
    Message.belongsTo(models.user, { foreignKey: 'receiver_id', as: 'receiver' });
  };

  return Message;
};
