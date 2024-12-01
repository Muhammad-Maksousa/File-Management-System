const FileService = require("../services/file");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors");
const { ResponseSenderWithToken, updateResponseSender, responseSender } = require("../helpers/wrappers/response-sender");
const GroupService = require("../services/group");
const GroupFilesService = require("../services/groupFile");

module.exports = {
    add: async (req, res) => {
        let { body } = req;
        body.ownerId = req.userId;
        if (req.file)
            body.dbName = req.file.filename;
        let isHeGroupOwner = await new GroupService({}).isHeGroupOwner(body.groupId, body.ownerId);
        const file = await new FileService({ ...body }).add();
        body.fileId = file.id;
        if (isHeGroupOwner) {
            body.approved = true;
        } else {
            body.approved = false;
        }
        await new GroupFilesService({ ...body }).add();
        responseSender(res, file);
    },
    getFileUploadRequists: async (req, res) => {
        const { groupId } = req.params;
        const result = await new GroupFilesService({ groupId }).getNotApproved();
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
    }
};