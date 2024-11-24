const UserService = require("../services/user");
const Role = require("../helpers/roles");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors");
const { ResponseSenderWithToken, updateResponseSender, responseSender } = require("../helpers/wrappers/response-sender");
const UserInvitationsService = require("../services/UserInvitations");
const GroupUserService = require("../services/groupUser");
const GroupService = require("../services/group");
const UserGroupPremissionsService = require("../services/userGroupPermission");

module.exports = {
    add: async (req, res) => {
        const { body } = req;
        const result = await new UserService({ ...body }).add();
        responseSender(res, result);
    },
    update: async (req, res) => {
        const id = req.userId;
        const { body } = req;
        const user = await new UserService({ ...body }).update(id);
        updateResponseSender(res, 'user');
    },
    login: async (req, res) => {
        const { body } = req;
        const result = await new UserService({ ...body }).login();
        ResponseSenderWithToken(res, result.user, result.token);
    },
    getById: async (req, res) => {
        const id = req.userId;
        const { isAdmin } = req;
        const data = await new UserService({}).getById(id);
        let result = { data: data, isAdmin: isAdmin };
        responseSender(res, result);
    },
    getMyGroupInvitations: async (req, res) => {
        const { userId } = req;
        const result = await new UserInvitationsService({ userId }).getMyInvitaions();
        responseSender(res, result);
    },
    acceptGroupInvitation: async (req, res) => {
        const { userId } = req;
        const { invitationId } = req.params;
        const invitaion = await new UserInvitationsService({}).getInvitation(invitationId);
        const groupId = invitaion.groupId;
        await new UserInvitationsService({}).deleteInvitation(invitationId);
        await new GroupUserService({ groupId, userId }).add();
        await new UserGroupPremissionsService({ groupId, userId }).addPermissions();
        responseSender(res, "You are now a group member check your groups");
    },
    declineGroupInvitation: async (req, res) => {
        const { invitationId } = req.params;
        await new UserInvitationsService({}).deleteInvitation(invitationId);
        responseSender(res, "Your Invitation Has Been Declined Successfully")
    },
    getMyGroups: async (req, res) => {
        const { userId } = req;
        const { isAdmin } = req;
        const myGroups = await new GroupUserService({ userId }).getMyGroups();
        const public = await new GroupService({}).getPublicGroups();
        let result = {
            isAdmin:isAdmin,
            myGroups: myGroups,
            publicGroups: public
        };
        responseSender(res, result);
    },
    usersToInvite: async (req, res) => {
        const { userId } = req;
        const { isAdmin } = req;
        const { groupId } = req.params;
        let users = await new GroupUserService({}).getAllUsersOfGroupRaw(groupId);
        users.push(userId);
        const data = await new UserService({}).getUsersNotInthisGroup(users);
        let result = { isAdmin: isAdmin,data: data };
        responseSender(res, result);
    },
    getMyOwnGroups: async (req, res) => {
        const ownerId = req.userId;
        const { isAdmin } = req;
        const data = await new GroupService({ ownerId }).getMyOwnGroups();
        let result = { isAdmin: isAdmin,data: data };
        responseSender(res, result);
    },
    removeUserFromMyGroup: async (req, res) => {
        const { body } = req;
        await new GroupUserService({ ...body }).removeUserFromMyGroup();
        responseSender(res, "the user has been removed successfuly");
    }
};
