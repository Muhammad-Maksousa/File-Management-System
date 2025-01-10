const FileHistory = require("../models/fileHistory");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const { Op, where, Sequelize } = require("sequelize");
const { File, User, groupFiles, Group } = require("../models");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require("fs");

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
            where: { fileId: fileId }, attributes: ["returned", [Sequelize.fn('date_format', Sequelize.col('FileHistory.createdAt'), '%d-%m-%Y %H:%i:%s'), "DownloadDate"], [Sequelize.fn('date_format', Sequelize.col('FileHistory.updatedAt'), '%d-%m-%Y %H:%i:%s'), "UploadDate"]], order: [['updatedAt', 'DESC']],
            include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }]
        });
    }
    async userStatictics(userId, fileIds) {
        return await FileHistory.findAll({
            where: { [Op.and]: [{ userId: userId }, { fileId: { [Op.in]: fileIds } }] }, attributes: ["returned", [Sequelize.fn('date_format', Sequelize.col('FileHistory.createdAt'), '%d-%m-%Y %H:%i:%s'), "DownloadDate"], [Sequelize.fn('date_format', Sequelize.col('FileHistory.updatedAt'), '%d-%m-%Y %H:%i:%s'), "UploadDate"]], include: { model: File, attributes: ["name"] }, order: [['updatedAt', 'DESC']]
        });
    }
    async deleteFileHistory(fileId) {
        return await FileHistory.destroy({ where: { fileId: fileId } });
    }
    async userDownloadedFiles(userId, data) {
        let newData = data;
        newData.GroupFiles.forEach(async (file) => {
            let canUpload = false;
            let userDownloadedFile = await FileHistory.findOne({ where: { [Op.and]: [{ userId: userId }, { fileId: file.fileId }, { returned: false }] } });
            if (userDownloadedFile)
                canUpload = true;
            file.File.dataValues.canUpload = canUpload;
        });
        return newData;
    }
    async writeFileStatsToCSV(statsInfo, fileInfo) {
        let requistDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let fileName = fileInfo.name + "_" + requistDate.replace(/:/g, '-');
        let updateFileName = fileName.replace(/ /g, '_') + ".csv";
        let filesPath = "../../public/files/csv/" + updateFileName;
        let pathToSave = path.join(__dirname, filesPath);
        fs.writeFileSync(pathToSave, "", function (err) {
            console.log(err);
        });
        let data = [];
        statsInfo.forEach(file => {
            let row = {
                firstName: file.User.firstName,
                lastName: file.User.lastName,
                DownloadDate: file.dataValues.DownloadDate,
                UploadDate: ""
            };
            if (file.returned == true)
                row.UploadDate = file.dataValues.UploadDate
            data.push(row);
        });

        const csvWriter = createCsvWriter({
            path: pathToSave,
            header: [
                { id: 'firstName', title: 'firstName' },
                { id: 'lastName', title: 'lastName' },
                { id: 'DownloadDate', title: 'DownloadDate' },
                { id: 'UploadDate', title: 'UploadDate' }
            ]
        });
        csvWriter.writeRecords(data)
            .then(() => {
                console.log('...Done');
            }).catch((err) => {
                console.log(err);
            });
        return updateFileName;
    }
    async writeUserStatsToCSV(statsInfo, userInfo) {
        let requistDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        let fileName = userInfo.firstName + "_" + userInfo.lastName + "_" + requistDate.replace(/:/g, '-');
        let updatedFileName = fileName.replace(/ /g, '_') + ".csv";

        let filesPath = "../../public/files/csv/" + updatedFileName;
        let pathToSave = path.join(__dirname, filesPath);
        fs.writeFileSync(pathToSave, "", function (err) {
            console.log(err);
        });

        let data = [];
        statsInfo.forEach(file => {
            let row = {
                File: file.File.name,
                DownloadDate: file.dataValues.DownloadDate,
                UploadDate: ""
            };
            if (file.returned == true)
                row.UploadDate = file.dataValues.UploadDate
            data.push(row);
        });
        const csvWriter = createCsvWriter({
            path: pathToSave,
            header: [
                { id: 'File', title: 'File' },
                { id: 'DownloadDate', title: 'DownloadDate' },
                { id: 'UploadDate', title: 'UploadDate' }
            ]
        });
        csvWriter.writeRecords(data)
            .then(() => {
                console.log('...Done');
            }).catch((err) => {
                console.log(err);
            });
        return updatedFileName;
    }
}
module.exports = FileHistoryService;
