const { Sequelize } = require("sequelize");
const dbConfigs = require("../../../configs.json").db;

const sequelize = new Sequelize({
    dialect: dbConfigs.dialect,
    host: dbConfigs.host,
    database: dbConfigs.database,
    username: dbConfigs.username,
    password: dbConfigs.password,
    pool: {
        max: 20,
        min: 0,
        idle: 10000,
        acquire: 60000,
    },
    define: { "charset": "utf8", "dialectOptions": { "collate": "utf8_general_ci" } },
});

module.exports = sequelize;
