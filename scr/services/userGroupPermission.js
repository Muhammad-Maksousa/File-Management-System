const UserGroupPremissions = require("../models/userGroupPremissions");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const { Op } = require("sequelize");
class UserGroupPremissionsService {
    constructor({ groupId, userId }) {
        this.groupId = groupId;
        this.userId = userId;
    }
    async addPermissions() {
        let userGroupPremissions = [
            {
                groupId: this.groupId,
                userId: this.userId,
                permission: 1
            },
            {
                groupId: this.groupId,
                userId: this.userId,
                permission: 2
            },
            {
                groupId: this.groupId,
                userId: this.userId,
                permission: 3
            }
        ]
        return await UserGroupPremissions.bulkCreate(userGroupPremissions);
    }
    async blockUser() {
        return await UserGroupPremissions.destroy({ where: { [Op.and]: [{ userId: this.userId }, { groupId: this.groupId }] } });
    }
    async restrict() {
        await UserGroupPremissions.destroy({ where: { [Op.and]: [{ userId: this.userId }, { groupId: this.groupId }, { permission: 3 }] } });
        return await UserGroupPremissions.destroy({ where: { [Op.and]: [{ userId: this.userId }, { groupId: this.groupId }, { permission: 1 }] } });
    }
    async unRestrict() {
        return await UserGroupPremissions.create({
            groupId: this.groupId,
            userId: this.userId,
            permission: 1
        });
    }
}
module.exports = UserGroupPremissionsService;
