const FileService = require("../services/file");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const { ResponseSenderWithToken, updateResponseSender, responseSender } = require("../helpers/wrappers/response-sender");
const GroupService = require("../services/group");
const GroupFilesService = require("../services/groupFile");
const UserGroupPremissionsService = require("../services/userGroupPermission");

module.exports = {
    add: async (req, res) => {
        let { body } = req;
        body.ownerId = req.userId;
        if (req.file)
            body.dbName = req.file.filename;

        let isHeGroupOwner = await new GroupService({}).isHeGroupOwner(body.groupId, body.ownerId);
        if (isHeGroupOwner) {
            body.approved = true;
        } else {
            body.userId = req.userId;
            body.approved = false;
            const uploadPermission = await new UserGroupPremissionsService({ ...body }).canUploadFile();

            if (!uploadPermission)
                throw new CustomError(errors.Not_Authorized);
        }
        const file = await new FileService({ ...body }).add();
        body.fileId = file.id;
        await new GroupFilesService({ ...body }).add();
        responseSender(res, file);
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
        body.userId = userId
        const checkInPermission = await new UserGroupPremissionsService({ ...body }).canCheckInFile();
        if (!checkInPermission)
            throw new CustomError(errors.Not_Authorized);
        const result = await new FileService({}).checkIn(body.fileIds);
        responseSender(res, result);
    },
    checkOutFile: async (req, res) => {

        

    }
};