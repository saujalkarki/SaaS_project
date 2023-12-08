//connecting DataBase
const dbConfig = require("../config/dbConfig");
const { Sequelize, DataTypes } = require("sequelize");

/*
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  oepratorAliases: false,
  port: 3306,
  pool: {
    mix: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
}); 
*/

const sequelize = new Sequelize(
  `${dbConfig.dialect}://${dbConfig.USER}@${dbConfig.HOST}:3306/${dbConfig.DB}`
);

// alternative for the above code
// const sequelize = new Sequelize("mysql://root@localhost:3306/SaaSProject1");

sequelize
  .authenticate()
  .then(() => {
    console.log("CONNECTED");
  })
  .catch((err) => {
    console.log("err" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./userModel")(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync done");
});

module.exports = db;
