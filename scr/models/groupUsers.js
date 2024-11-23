const sequelize = require("../helpers/db/init");
const { DataTypes } = require("sequelize");
const User = require("./user");
const Group = require("./group");
const GroupUsers = sequelize.define("GroupUsers", {
    userId: {
        type: DataTypes.INTEGER,
    },
    groupId: {
        type: DataTypes.INTEGER,
    }
});

GroupUsers.belongsTo(User, {foreignKey: "userId"});
User.hasMany(GroupUsers, {foreignKey: "userId"});

GroupUsers.belongsTo(Group, {foreignKey: "groupId"});
Group.hasMany(GroupUsers, {foreignKey: "groupId"});

module.exports = GroupUsers;