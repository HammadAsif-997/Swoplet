const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Register models
db.user = require('./user.model')(sequelize, DataTypes);
db.productlisting = require('./productlisting.model')(sequelize, DataTypes);
db.mediafile = require('./mediafile.model')(sequelize, DataTypes);
db.productcondition = require('./productcondition.model')(sequelize, DataTypes);
db.productcategory = require('./productcategory.model')(sequelize, DataTypes);
db.chat = require('./chat.model')(sequelize, DataTypes);
db.message = require('./message.model')(sequelize, DataTypes);
db.favourite = require('./favourite.model')(sequelize, DataTypes);
db.user_report = require('./userreport.model')(sequelize, DataTypes);
db.sellerToReview = require('./sellertoreview.model')(sequelize, DataTypes);
db.sellerReview = require('./sellerreview.model')(sequelize, DataTypes);




// Apply associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
