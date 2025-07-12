// favourite.model.js

module.exports = (sequelize, DataTypes) => {
  const Favourite = sequelize.define("favourite", {
    // Primary key
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    // Foreign key - user
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    // Foreign key - product
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    // Timestamp of saving
    saved_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  // Define associations (optional, but useful)
  Favourite.associate = (models) => {
    Favourite.belongsTo(models.user, { foreignKey: 'user_id' });
    Favourite.belongsTo(models.productlisting, { foreignKey: 'product_id' });
  };

  return Favourite;
};
