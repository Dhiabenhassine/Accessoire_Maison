const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("accessoire_maison", "root", "", {
  host: "127.0.0.1",
  dialect: "mysql",
});

/* const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_MDP, {
    host: 'localhost',
    dialect: 'mysql' 
});
*/

// testing the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();

module.exports = sequelize;
