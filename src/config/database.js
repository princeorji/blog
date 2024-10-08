const { Sequelize, DataTypes } = require('sequelize');
const env = require('../utils/setEnv');

const sequelize = new Sequelize(env.DATABASE);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Add our tables
db.users = require('../models/user')(sequelize, DataTypes);
db.posts = require('../models/post')(sequelize, DataTypes);

// Set up associations
db.users.hasMany(db.posts, { foreignKey: 'author' });
db.posts.belongsTo(db.users, { foreignKey: 'author' });

const connectdb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // sync all models
    // force: false will not drop the table if it already exists
    await db.sequelize.sync({ force: false });
    console.log('Database tables synced');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

connectdb();

module.exports = db;
