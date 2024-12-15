const File = require("../models/file");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const fs = require("fs");
const path = require('path');
const { promisify } = require('util');
const removeFile = promisify(fs.unlink);
const { Op } = require("sequelize");
class FileService {
    constructor({ name, dbName, free, ownerId }) {
        this.name = name;
        this.dbName = dbName;
        this.free = free;
        this.ownerId = ownerId;
    }
    async add() {
        return await File.create({
            name: this.name,
            dbName: this.dbName,
            ownerId: this.ownerId,
            free: this.free
        });
    }
    async update(id) {
        return await File.update({
            name: this.name,
            free: this.free
        }, { where: { id: id } });
    }
    async checkIn(ids) {
        return await File.update({ free: false }, { where: { id: ids } });
    }
    async checkOut(id) {
        return await File.update({ free: true }, { where: { id: id } });
    }
    async newDbName(fileId, newDbName) {
        const file = await File.findByPk(fileId);
        let filesPath = "./public/files/" + file.dbName;
        await removeFile(filesPath);
        return await File.update({ dbName: newDbName }, { where: { id: fileId } });
    }
    async deleteFile(id) {
        const file = await File.findByPk(id);
        let filesPath = "../../public/files/" + file.dbName;
        await removeFile(path.join(__dirname, filesPath));
        return await File.destroy({ where: { id: id } });
    }
    async allFiles(){
        return await File.findAll();
    }
}
module.exports = FileService;
