module.exports = (sequelize, DataTypes) => {
  const ProductListing = sequelize.define('productlisting', {
    id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, autoIncrement: true, primaryKey: true},
    title: DataTypes.STRING(255),
    description: DataTypes.TEXT,
    category_id: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false},
    price: DataTypes.DECIMAL(10, 2),
    product_condition_id: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false},
    tags: DataTypes.TEXT,
    location: DataTypes.STRING(255),
    created_by_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false},
    status: DataTypes.TINYINT.UNSIGNED,
    previous_status: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    //for soft delete variable
    is_deleted: {
  type: DataTypes.TINYINT,
  allowNull: false,
  defaultValue: 0
},
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    tableName: 'product_listings',
    timestamps: false,
    underscored: true
  });

  ProductListing.associate = (models) => {
    ProductListing.hasMany(models.mediafile, {foreignKey: 'product_id', as: 'mediafiles'});
    ProductListing.belongsTo(models.productcategory, {foreignKey: 'category_id',as: 'category' });
    ProductListing.belongsTo(models.productcondition, { foreignKey: 'product_condition_id', as: 'condition'});
    ProductListing.belongsTo(models.user, { foreignKey: 'created_by_id', as: 'creator'});
  };

  return ProductListing;
};
