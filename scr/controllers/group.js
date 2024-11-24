const GroupService = require("../services/group");
const GroupUserService = require("../services/groupUser");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const { ResponseSenderWithToken, updateResponseSender, responseSender } = require("../helpers/wrappers/response-sender");
const UserInvitationsService = require("../services/UserInvitations");
const UserGroupPremissionsService = require("../services/userGroupPermission");

module.exports = {
    add: async (req, res) => {
        let { body } = req;
        body.ownerId = req.userId;
        if (req.file)
            body.image = req.file.filename;
        const result = await new GroupService({ ...body }).add();
        responseSender(res, result);
    },
    update: async (req, res) => {
        const { groupId } = req.params;
        const { userId } = req;
        const { body } = req;
        if (req.file)
            body.image = req.file.filename;
        let validOwner = await new GroupService({}).isHeGroupOwner(userId, groupId);

        if (!validOwner)
            return new CustomError(errors.You_Can_Not_Do_This);

        const user = await new GroupService({ ...body }).update(groupId);
        updateResponseSender(res, 'user');
    },
    sendJoinRequestToMyGroup: async (req, res) => {
        const { body } = req;
        await new UserInvitationsService({ ...body }).add();
        responseSender(res, "Your Invitation Has Been Sent Successfully");
    },
    getOne: async (req, res) => {
        const { userId } = req;
        const { isAdmin } = req;
        const { groupId } = req.params;
        const data = await new GroupService({}).getOne(groupId);
        let result = { groupOwner: false, isAdmin: isAdmin, data: data };
        const isHeGroupOwner = await new GroupService({}).isHeGroupOwner(groupId, userId);
        if (isHeGroupOwner)
            result.groupOwner = true;
        responseSender(res, result);
    },
    block: async (req, res) => {
        const { body } = req;
        await new UserGroupPremissionsService({ ...body }).blockUser();
        responseSender(res, "The User Has Been Blocked");
    },
    unBlock: async (req, res) => {
        const { body } = req;
        await new UserGroupPremissionsService({ ...body }).addPermissions();
        responseSender(res, "The User Has Been UnBlocked");
    },
    restrict: async (req, res) => {
        const { body } = req;
        await new UserGroupPremissionsService({ ...body }).restrict();
        responseSender(res, "The User Has Been Restricted");
    },
    unRestrict: async (req, res) => {
        const { body } = req;
        await new UserGroupPremissionsService({ ...body }).unRestrict();
        responseSender(res, "The User Has Been Unrestricted");
    },
    usersOfGroup: async (req, res) => {
        const { userId } = req;
        const { isAdmin } = req;
        const { groupId } = req.params;
        const data = await new GroupUserService({}).getAllUsersOfGroup(groupId);
        let result = { groupOwner: false, isAdmin: isAdmin, data: data };
        const isHeGroupOwner = await new GroupService({}).isHeGroupOwner(groupId, userId);
        if (isHeGroupOwner)
            result.groupOwner = true;
        responseSender(res, result);
    }
};
