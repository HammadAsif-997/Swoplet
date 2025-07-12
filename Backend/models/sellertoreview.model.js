module.exports = (sequelize, DataTypes) => {
    const SellerToReview = sequelize.define('sellerToReview', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        seller_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        buyer_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        product_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'product_listings',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        is_reviewed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        purchase_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        tableName: 'seller_to_review',
        timestamps: false
    });

    SellerToReview.associate = (models) => {
        SellerToReview.belongsTo(models.user, { foreignKey: 'seller_id', as: 'seller', onDelete: 'CASCADE' });
        SellerToReview.belongsTo(models.user, { foreignKey: 'buyer_id', as: 'buyer', onDelete: 'CASCADE' });
        SellerToReview.belongsTo(models.productlisting, { foreignKey: 'product_id', as: 'product', onDelete: 'CASCADE' });
    };

    return SellerToReview;
};