const GroupUser = require("../models/groupUsers");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const Group = require("../models/group");
const { Op } = require("sequelize");
const User = require("../models/user");
const { UserGroupPermissions } = require("../models");
const UserInvitations = require("../models/UserInvitations");

class GroupUserService {
    constructor({ groupId, userId }) {
        this.groupId = groupId;
        this.userId = userId;
    }
    async add() {
        return await GroupUser.create({
            groupId: this.groupId,
            userId: this.userId
        });
    }
    async getMyGroups() {
        return await GroupUser.findAll({ where: { userId: this.userId }, attributes: ['groupId'], include: [{ model: Group, attributes: ['name', 'image'] }] });
    }
    async getAllUsersOfGroupRaw(groupId) {
        let result = [];
        let groupUsers = await GroupUser.findAll({ raw: true, where: { groupId: groupId }, attributes: ['userId'] });
        let usersAlreadyInvited = await UserInvitations.findAll({ raw: true, where: { groupId: groupId } });
        for (let i of groupUsers) {
            result.push(i.userId);
        }
        for (let i of usersAlreadyInvited) {
            result.push(i.userId);
        }
        return result;
    }
    async getAllUsersOfGroup(groupId) {
        return await GroupUser.findAll({ where: { groupId: groupId }, attributes: [], include: { model: User, attributes: ['id', 'email', 'firstName', 'lastName'], include: { model: UserGroupPermissions, attributes: ['permission'] } } });
    }
    async removeUserFromMyGroup() {
        return await GroupUser.destroy({ where: { [Op.and]: [{ userId: this.userId }, { groupId: this.groupId }] } });
    }
    async deleteGroupUsers(groupId) {
        return await GroupUser.destroy({ where: { groupId: groupId } });
    }
}
module.exports = GroupUserService;
