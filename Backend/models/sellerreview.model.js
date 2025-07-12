module.exports = (sequelize, DataTypes) => {
    const SellerReview = sequelize.define('sellerreview', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        reviewee_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        reviewer_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        to_review_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'seller_to_review',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        review_value: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 5
            }
        },
        review_comment: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null
        },
        review_date: {
        type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
    }, {
        tableName: 'seller_review',
        timestamps: false
    });

    SellerReview.associate = (models) => {
        SellerReview.belongsTo(models.user, { foreignKey: 'reviewee_id', as: 'reviewee', onDelete: 'CASCADE' });
        SellerReview.belongsTo(models.user, { foreignKey: 'reviewer_id', as: 'reviewer', onDelete: 'CASCADE' });
        SellerReview.belongsTo(models.sellerToReview, { foreignKey: 'to_review_id', as: 'toReview', onDelete: 'CASCADE' });
    };

    return SellerReview;
};
