const GroupFiles = require("../models/groupFiles");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const { Op } = require("sequelize");
const File = require("../models/file");
const User = require("../models/user");

class GroupFilesService {
    constructor({ groupId, fileId, approved }) {
        this.groupId = groupId;
        this.fileId = fileId;
        this.approved = approved;
    }
    async add() {
        return await GroupFiles.create({
            groupId: this.groupId,
            fileId: this.fileId,
            approved: this.approved
        });
    }
    async getNotApproved() {
        return await GroupFiles.findAll({ where: { [Op.and]: [{ groupId: this.groupId }, { approved: false }] }, attributes: ['id'], include: { model: File, attributes: ['id', 'name', 'dbName'], include: { model: User, attributes: ['id', 'email', 'firstName', 'lastName'] } } });
    }
    async approveUploadedFile(id) {
        return await GroupFiles.update({ approved: true }, { where: { id: id } })
    }
    async declineUploadedFile(id) {
        let fileId = await GroupFiles.findByPk(id);
        await GroupFiles.destroy({ where: { id: id } });
        return fileId;
    }
    async deleteFile(fileId) {
        return await GroupFiles.destroy({ where: { fileId: fileId } });
    }
}
module.exports = GroupFilesService;
