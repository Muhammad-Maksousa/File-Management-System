const FileHistory = require("../models/fileHistory");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const { Op, where, Sequelize } = require("sequelize");
const { File, User, groupFiles, Group } = require("../models");

class FileHistoryService {
    constructor({ userId, fileId }) {
        this.userId = userId;
        this.fileId = fileId;
    }
    async add(userId, fileIds) {
        let rows = [];
        fileIds.forEach(fileId => {
            let row = {
                userId: userId,
                fileId: fileId,
                returned: false
            };
            rows.push(row);
        });
        return await FileHistory.bulkCreate(rows);
    }
    async update(userId, fileId) {
        const row = await FileHistory.findOne({ where: { [Op.and]: [{ userId: userId }, { fileId: fileId }, { returned: false }] } });
        return await FileHistory.update({ returned: true }, { where: { id: row.id } });
    }
    async fileStatictics(fileId) {
        return await FileHistory.findAll({
            where: { fileId: fileId }, attributes: ["returned", [Sequelize.fn('date_format', Sequelize.col('FileHistory.createdAt'), '%d-%m-%Y %H:%i:%s'), "Download Date"], [Sequelize.fn('date_format', Sequelize.col('FileHistory.updatedAt'), '%d-%m-%Y %H:%i:%s'), "Upload Date"]], order: [['updatedAt', 'DESC']],
            include: [{ model: User, attributes: ['id', 'firstName', 'lastName', "email"] }]
        });
    }
    async userStatictics(userId, fileIds) {
        return await FileHistory.findAll({
            where: { [Op.and]: [{ userId: userId }, { fileId: { [Op.in]: fileIds } }] }, attributes: ["fileId", "returned", [Sequelize.fn('date_format', Sequelize.col('FileHistory.createdAt'), '%d-%m-%Y %H:%i:%s'), "Download Date"], [Sequelize.fn('date_format', Sequelize.col('FileHistory.updatedAt'), '%d-%m-%Y %H:%i:%s'), "Upload Date"]], include: { model: File, attributes: ["name"] }, order: [['updatedAt', 'DESC']]
        });
    }
    async deleteFileHistory(fileId) {
        return await FileHistory.destroy({ where: { fileId: fileId } });
    }
    async userDownloadedFiles(userId, data) {
        let newData = data;
        newData.GroupFiles.forEach(async (file) => {
            console.log(file.File.dataValues);
            let canUpload = false;
            let userDownloadedFile = await FileHistory.findOne({ where: { [Op.and]: [{ userId: userId }, { fileId: file.fileId }, { returned: false }] } });
            if(userDownloadedFile)
                canUpload = true;
            file.File.dataValues.canUpload=canUpload;
        });
        return newData;
    }
}
module.exports = FileHistoryService;
