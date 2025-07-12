module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('chat', {
    chat_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    other_person_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    last_message_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    owner_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    other_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false,
    tableName: 'chats'
  });

  Chat.associate = (models) => {
    Chat.belongsTo(models.productlisting, { foreignKey: 'product_id', as: 'product' });
    Chat.belongsTo(models.user, { foreignKey: 'product_owner_id', as: 'owner' });
    Chat.belongsTo(models.user, { foreignKey: 'other_person_id', as: 'otherPerson' });
    Chat.belongsTo(models.message, { foreignKey: 'last_message_id', as: 'lastMessage' });

    Chat.hasMany(models.message, { foreignKey: 'chat_id', as: 'messages' });
  };

  return Chat;
};
