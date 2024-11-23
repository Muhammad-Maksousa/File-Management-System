const sequelize = require("../helpers/db/init");
const { DataTypes } = require("sequelize");
const User = require("./user");
const Group = require("./group");
const UserInvitations = sequelize.define("UserInvitations", {
    userId: {
        type: DataTypes.INTEGER,
    },
    groupId: {
        type: DataTypes.INTEGER,
    },
    message: {
        type: DataTypes.STRING,
    }
});

UserInvitations.belongsTo(User, { foreignKey: "userId" });
User.hasMany(UserInvitations, { foreignKey: "userId" });

UserInvitations.belongsTo(Group, { foreignKey: "groupId" });
Group.hasMany(UserInvitations, { foreignKey: "groupId" });

module.exports = UserInvitations;