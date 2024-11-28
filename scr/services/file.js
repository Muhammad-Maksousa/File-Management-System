const File = require("../models/file");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
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
    async changeStatus(id) {
        const file = await File.findByPk(id);
        return await File.update({ free: !file.free }, { where: { id: id } });
    }
    async newDbName(file){
        //await
    }
}
module.exports = FileService;
