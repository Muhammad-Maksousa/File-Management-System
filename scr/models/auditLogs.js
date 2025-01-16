const sequelize = require("../helpers/db/init");
const { DataTypes } = require("sequelize");
const User = require("./user");
const AuditLog = sequelize.define("AuditLog", {
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    method: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    requestParams: {
        type: DataTypes.STRING,
        allowNull: true
    },
    requestBody: {
        type: DataTypes.STRING,
        allowNull: true
    },
    response: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

AuditLog.belongsTo(User, {foreignKey: "userId"});
User.hasMany(AuditLog, {foreignKey: "userId"});

module.exports = AuditLog;