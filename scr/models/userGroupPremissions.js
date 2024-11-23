const sequelize = require("../helpers/db/init");
const { DataTypes } = require("sequelize");
const User = require("./user");
const Group = require("./group");
const UserGroupPermissions = sequelize.define("UserGroupPermission", {
    userId: {
        type: DataTypes.INTEGER,
    },
    groupId: {
        type: DataTypes.INTEGER,
    },
    permission: {
        type : DataTypes.INTEGER
    }
});

UserGroupPermissions.belongsTo(User, {foreignKey: "userId"});
User.hasMany(UserGroupPermissions, {foreignKey: "userId"});

UserGroupPermissions.belongsTo(Group, {foreignKey: "groupId"});
Group.hasMany(UserGroupPermissions, {foreignKey: "groupId"});

module.exports = UserGroupPermissions;