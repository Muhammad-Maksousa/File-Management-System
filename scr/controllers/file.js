const FileService = require("../services/file");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors");
const { ResponseSenderWithToken, updateResponseSender, responseSender } = require("../helpers/wrappers/response-sender");
const GroupService = require("../services/group");

module.exports = {
    add: async (req, res) => {
        let { body } = req;
        body.ownerId = req.userId;
        if (req.file)
            body.dbName = req.file.filename;
        let isHeGroupOwner = await new GroupService({}).isHeGroupOwner(body.groupId,body.ownerId);
        if(isHeGroupOwner){
            
        }else{

        }
        const result = await new FileService({ ...body }).add();
        responseSender(res, result);
    }
};