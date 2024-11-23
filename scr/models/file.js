const sequelize = require("../helpers/db/init");
const { DataTypes } = require("sequelize");
const User = require("./user");
const File = sequelize.define("File", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dbName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    free: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

File.belongsTo(User, {foreignKey: "ownerId"});
User.hasMany(File, {foreignKey: "ownerId"});

module.exports = File;