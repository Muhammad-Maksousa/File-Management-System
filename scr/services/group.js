const Group = require("../models/group");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const { Op } = require("sequelize");
const GroupFiles = require("../models/groupFiles");
class GroupService {
    constructor({ name, image, isPublic, ownerId }) {
        this.name = name;
        this.image = image;
        this.isPublic = isPublic;
        this.ownerId = ownerId;
    }
    async add() {
        return await Group.create({
            name: this.name,
            image: this.image,
            ownerId: this.ownerId,
            isPublic: this.isPublic
        });
    }
    async update(id) {
        return await Group.update({
            name: this.name,
            image: this.image,
            isPublic: this.isPublic
        }, { where: { id: id } });
    }
    async getMyOwnGroups() {
        return await Group.findAll({ where: { [Op.and]: [{ ownerId: this.ownerId }, { isPublic: false }] }, attributes: ['id', 'name', 'image', 'isPublic'] });
    }
    async isHeGroupOwner(groupId, ownerId) {
        return await Group.findOne({ where: { [Op.and]: [{ ownerId: ownerId }, { id: groupId }] } });
    }
    async getPublicGroups() {
        return await Group.findAll({ where: { isPublic: 1 }, attributes: ['id', 'name', 'image'] });
    }
    async getOne(id) {
        return await Group.findOne({ where: { id: id }, attributes: ['id', 'name', 'image', 'isPublic'], include: { model: GroupFiles } });
    }
}
module.exports = GroupService;
