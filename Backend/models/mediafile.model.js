module.exports = (sequelize, DataTypes) => {
  const MediaFile = sequelize.define('mediafile', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    file_path: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    uploaded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'media_files',
    timestamps: false,
    underscored: true
  });

  MediaFile.associate = (models) => {
    MediaFile.belongsTo(models.productlisting, {
      foreignKey: 'product_id',
      as: 'product'
    });
  };

  return MediaFile;
};
