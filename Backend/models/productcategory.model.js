module.exports = (sequelize, DataTypes) => {
  const ProductCategory = sequelize.define('productcategory', {
    id: {
      type: DataTypes.TINYINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'product_categories',
    timestamps: false
  });

  ProductCategory.associate = (models) => {
    ProductCategory.hasMany(models.productlisting, { foreignKey: 'category_id', as: 'product_listings' });
  };

  return ProductCategory;
};
