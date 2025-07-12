module.exports = (sequelize, DataTypes) => {
  const ProductCondition = sequelize.define('productcondition', {
    id: {
      type: DataTypes.TINYINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'product_conditions',
    timestamps: false,
    underscored: true
  });

  return ProductCondition;
};
