const sequelize = require("../helpers/db/init");
const { DataTypes } = require("sequelize");
const File = require("./file");
const Group = require("./group");
const GroupFiles = sequelize.define("GroupFiles", {
    fileId: {
        type: DataTypes.INTEGER,
    },
    groupId: {
        type: DataTypes.INTEGER,
    }
});


GroupFiles.belongsTo(File, {foreignKey: "fileId"});
File.hasOne(GroupFiles, {foreignKey: "fileId"});

GroupFiles.belongsTo(Group, {foreignKey: "groupId"});
Group.hasMany(GroupFiles, {foreignKey: "groupId"});

module.exports = GroupFiles;