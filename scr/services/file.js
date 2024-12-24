const File = require("../models/file");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const fs = require("fs");
const path = require('path');
const { promisify } = require('util');
const removeFile = promisify(fs.unlink);
const { Op, Sequelize } = require("sequelize");
const User = require("../models/user");
const GroupFiles = require("../models/groupFiles");
const { Group } = require("../models");
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
    async checkIn(ids, transaction) {
        return await File.update({ free: false }, { where: { id: ids } }, { transaction: transaction });
    }
    async checkOut(id) {
        return await File.update({ free: true }, { where: { id: id } });
    }
    async checkIfAllFree(ids, transaction) {
        const files = await File.findAll({ where: { id: { [Op.in]: ids } } }, { transaction: transaction });
        let allFileAreFree = true, nameOfTakenFile = "";
        files.forEach(file => {
            if (file.free == false) {
                allFileAreFree = false;
                nameOfTakenFile = file.name;
            }
        });
        return { allFileAreFree: allFileAreFree, nameOfTakenFile: nameOfTakenFile };
    }
    async newDbName(fileId, newDbName, oldDbName) {
        let filesPath = "./public/files/" + oldDbName;
        await removeFile(filesPath);
        return await File.update({ dbName: newDbName, free: true }, { where: { id: fileId } });
    }
    async deleteFile(id) {
        const file = await File.findByPk(id);
        let filesPath = "../../public/files/" + file.dbName;
        await removeFile(path.join(__dirname, filesPath));
        return await File.destroy({ where: { id: id } });
    }
    async allFiles() {
        return await File.findAll();
    }
    async getFilePath(id) {
        const file = await File.findByPk(id);
        let filesPath = "../../public/files/" + file.dbName;
        return { path: path.join(__dirname, filesPath), name: file.name, dbName: file.dbName };
    }
    async getOne(id) {
        return await File.findOne({
            where: { id: id }, attributes: ["name", "dbName", "free", [Sequelize.fn('date_format', Sequelize.col('File.createdAt'), '%d-%m-%Y %H:%i:%s'), "UploadedAt"], 'ownerId'],
            include: [{ model: User, attributes: ['firstName', 'lastName', "email"] }, { model: GroupFiles, attributes: ['groupId'], include: { model: Group, attributes: ['name', 'image', 'isPublic'] } }]
        });
    }
}
module.exports = FileService;
