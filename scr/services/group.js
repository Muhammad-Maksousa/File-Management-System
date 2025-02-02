const Group = require("../models/group");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const { Op } = require("sequelize");
const GroupFiles = require("../models/groupFiles");
const File = require("../models/file");
const User = require("../models/user");
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
        return await Group.findOne({ where: { id: id }, attributes: ['id', 'name', 'image', 'isPublic'], include: { model: GroupFiles, where: { approved: true }, required: false, attributes: ['fileId'], include: { model: File, attributes: ['name', 'dbName', 'free', 'ownerId'] } } });
    }
    async getAll() {
        return await Group.findAll({ attributes: ['id', 'name', 'image', 'isPublic'] });
    }
    async getNotApprovedFiles(ownerId) {
        return await Group.findAll({ where: { ownerId: ownerId }, attributes: ['id', 'name', 'image', 'isPublic'], include: { model: GroupFiles, where: { approved: false }, required: true, attributes: ['id'], include: { model: File, attributes: ['id', 'name', 'dbName'], include: { model: User, attributes: ['id', 'email', 'firstName', 'lastName'] } } } });
    }
    async getBasicInfo(id) {
        return await Group.findOne({ where: { id: id }, attributes: ['name', 'image', 'isPublic'] });
    }
    async delete(id) {
        return await Group.destroy({ where: { id: id } });
    }
}
module.exports = GroupService;
