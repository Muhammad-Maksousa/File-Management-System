const FileHistory = require("../models/fileHistory");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const { Op, where } = require("sequelize");
const File = require("../models/file");
const User = require("../models/user");

class FileHistoryService {
    constructor({ userId, fileId }) {
        this.userId = userId;
        this.fileId = fileId;
    }
    async add(userId,fileIds) {
        let rows = [];
        fileIds.forEach(fileId => {
            let row = {
                userId:userId,
                fileId:fileId,
                returned:false
            };
            rows.push(row);
        });
        return await FileHistory.bulkCreate(rows);
    }
    async update(userId,fileId) {
        const row = await FileHistory.findOne({ where: { [Op.and]: [{ userId: userId }, { fileId: fileId }, { returned: false }] } });
        return await FileHistory.update({ returned: true }, { where: { id: row.id } });
    }
}
module.exports = FileHistoryService;
