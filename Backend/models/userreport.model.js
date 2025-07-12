module.exports = (sequelize, DataTypes) => {
  const UserReport = sequelize.define('user_report', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    reported_by_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    reported_user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'user_reports',
    timestamps: false,
    underscored: true
  });

  UserReport.associate = (models) => {
    UserReport.belongsTo(models.user, {
      foreignKey: 'reported_by_id',
      as: 'reporter'
    });
    UserReport.belongsTo(models.user, {
      foreignKey: 'reported_user_id',
      as: 'reportedUser'
    });
  };

  return UserReport;
};
