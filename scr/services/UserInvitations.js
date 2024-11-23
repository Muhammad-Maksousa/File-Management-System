const UserInvitations = require("../models/UserInvitations");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const { Op } = require("sequelize");
const Group = require("../models/group");
const { User } = require("../models");

class UserInvitationsService {
    constructor({ groupId, userId, message }) {
        this.groupId = groupId;
        this.userId = userId;
        this.message = message;
    }
    async add() {
        return await UserInvitations.create({
            groupId: this.groupId,
            userId: this.userId,
            message: this.message
        });
    }
    async getMyInvitaions() {
        return await UserInvitations.findAll({ where: { userId: this.userId },attributes:['id','message'], include: { model: Group, attributes: ['id', 'name', 'image'], include: { model: User, attributes: ['id', 'username'] } } });
    }
    async getInvitation(id) {
        return await UserInvitations.findByPk(id);
    }
    async deleteInvitation(id) {
        return await UserInvitations.destroy({ where: { id: id } });
    }
}
module.exports = UserInvitationsService;
