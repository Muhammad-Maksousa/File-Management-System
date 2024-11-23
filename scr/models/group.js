const sequelize = require("../helpers/db/init");
const { DataTypes } = require("sequelize");
const User = require("./user");
const Group = sequelize.define("Group", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ownerId: {
        type: DataTypes.INTEGER,
    },
    image: {
        type: DataTypes.STRING,
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

Group.belongsTo(User, {foreignKey: "ownerId"});
User.hasMany(Group, {foreignKey: "ownerId"});

module.exports = Group;