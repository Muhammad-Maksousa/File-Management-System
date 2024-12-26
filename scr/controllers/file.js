const FileService = require("../services/file");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const { ResponseSenderWithToken, updateResponseSender, responseSender } = require("../helpers/wrappers/response-sender");
const GroupService = require("../services/group");
const GroupFilesService = require("../services/groupFile");
const UserGroupPremissionsService = require("../services/userGroupPermission");
const FileHistoryService = require("../services/fileHistory");
const UserService = require("../services/user");
const sequelize = require("../helpers/db/init");
const mime = require('mime-types');
module.exports = {
    add: async (req, res) => {
        let { body } = req;
        body.ownerId = req.userId;
        let message;
        if (req.file)
            body.dbName = req.file.filename;

        let isHeGroupOwner = await new GroupService({}).isHeGroupOwner(body.groupId, body.ownerId);
        if (isHeGroupOwner || req.isAdmin == true) {
            body.approved = true;
            message = "The file has been uploaded to the group successfully";
        } else {
            body.userId = req.userId;
            body.approved = false;
            const uploadPermission = await new UserGroupPremissionsService({ ...body }).canUploadFile();
            message = "The file need to be approved by The group owner befor adding it to the group files";
            if (!uploadPermission)
                throw new CustomError(errors.Not_Authorized);
        }
        const file = await new FileService({ ...body }).add();
        body.fileId = file.id;
        await new GroupFilesService({ ...body }).add();
        responseSender(res, message);
    },
    getFileUploadRequists: async (req, res) => {
        const ownerId = req.userId;
        const result = await new GroupService({}).getNotApprovedFiles(ownerId);
        responseSender(res, result);
    },
    acceptFile: async (req, res) => {
        const { groupFileId } = req.params;
        const result = await new GroupFilesService({}).approveUploadedFile(groupFileId);
        responseSender(res, "The file has been approved");
    },
    declineFile: async (req, res) => {
        const { groupFileId } = req.params;
        const groupFile = await new GroupFilesService({}).declineUploadedFile(groupFileId);
        const file = await new FileService({}).deleteFile(groupFile.fileId);
        responseSender(res, "The file has been declined");
    },
    checkInFile: async (req, res) => {
        const { userId } = req;
        let { body } = req;
        let checkIfAllFree;
        body.userId = userId;
        const checkInPermission = await new UserGroupPremissionsService({ ...body }).canCheckInFile();
        if (!checkInPermission)
            throw new CustomError(errors.Not_Authorized);
        const transaction = await sequelize.transaction({ autocommit: false });
        try {
            checkIfAllFree = await new FileService({}).checkIfAllFree(body.fileIds, transaction);
            if (checkIfAllFree.allFileAreFree == true) {
                await new FileService({}).checkIn(body.fileIds, transaction);
                await new FileHistoryService({}).add(userId, body.fileIds);
                await transaction.commit();
                responseSender(res, "Downloading Your files.");
            } else {
                await transaction.rollback();
                responseSender(res, "The file " + checkIfAllFree.nameOfTakenFile + " is taken please choose only free files", "failed", 200);
            }
        } catch (err) {
            console.log(err);
            await transaction.rollback();
            throw new CustomError(errors.Internal_Server_Error);
        }
    },
    checkOutFile: async (req, res) => {
        const { body, userId } = req;
        if (!req.file)
            throw new CustomError(errors.Missing_Value_Field);
        let newDbName = req.file.filename, newFileName = req.file.originalname;
        let file = await new FileService({}).getFilePath(body.fileId);

        if (file.name != newFileName.substring(0, newFileName.indexOf('.')))
            throw new CustomError(errors.Did_Not_Match_File_Name);

        if (mime.lookup(file.path) != mime.lookup(req.file.path))
            throw new CustomError(errors.Did_Not_Match_File_Type);

        await new FileService({}).newDbName(body.fileId, newDbName, file.dbName);
        await new FileHistoryService({}).update(userId, body.fileId);
        responseSender(res, "Your File Has Been Uploaded Successfully");
    },
    allFiles: async (req, res) => {
        const result = await new FileService({}).allFiles();
        responseSender(res, result);
    },
    deleteFile: async (req, res) => {
        const { fileId, groupId } = req.body;
        const { userId, isAdmin } = req;
        let isHeGroupOwner = await new GroupService({}).isHeGroupOwner(groupId, userId);
        if (!isHeGroupOwner && !isAdmin)
            throw new CustomError(errors.Not_GroupOwner);
        await new GroupFilesService({}).deleteFile(fileId);
        await new FileService({}).deleteFile(fileId);
        responseSender(res, "The file has been deleted successfully");
    },
    fileStatistics: async (req, res) => {
        const { fileId } = req.params;
        const fileInfo = await new FileService({}).getOne(fileId);
        const fileStatistics = await new FileHistoryService({}).fileStatictics(fileId);
        responseSender(res, { fileInfo: fileInfo, fileStatistics: fileStatistics });
    },
    userStatistics: async (req, res) => {
        const { userId, body, isAdmin } = req;
        const isHeGroupOwner = await new GroupService({}).isHeGroupOwner(body.groupId, userId);
        if (!isHeGroupOwner && !isAdmin)
            throw new CustomError(errors.Not_Authorized);
        const fileIds = await new GroupFilesService({}).getFilesOfGroup(body.groupId);
        const stats = await new FileHistoryService({}).userStatictics(body.userId, fileIds);
        const group = await new GroupService({}).getBasicInfo(body.groupId);
        const user = await new UserService({}).getBasicInfo(userId);
        let result = {
            userInfo: user,
            groupInfo: group,
            userStatistics: stats
        };
        responseSender(res, result);
    }
};