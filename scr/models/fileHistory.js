const sequelize = require("../helpers/db/init");
const { DataTypes } = require("sequelize");
const User = require("./user");
const File = require("./file");
const FileHistory = sequelize.define("FileHistory", {
    userId: {
        type: DataTypes.INTEGER,
    },
    fileId: {
        type: DataTypes.INTEGER,
    },
    returned: {
        type: DataTypes.BOOLEAN,
        defaultValue:false
    }
});

FileHistory.belongsTo(User, {foreignKey: "userId"});
User.hasMany(FileHistory, {foreignKey: "userId"});

FileHistory.belongsTo(File, {foreignKey: "fileId"});
File.hasMany(FileHistory, {foreignKey: "fileId"});

module.exports = FileHistory;