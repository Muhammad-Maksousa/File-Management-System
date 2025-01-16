const AuditLog = require("../models/auditLogs");
const CustomError = require("../helpers/errors/custom-errors");
const errors = require("../helpers/errors/errors.json");
const { Op } = require("sequelize");
class AuditLogService {
    async getLogs() {
        let logs =  await AuditLog.findAll({ order: [['createdAt', 'DESC']] });
        logs.forEach(log => {
            log.requestParams = log.requestParams;
            log.response = log.response;
            log.requestBody = log.requestBody;
        });
        return logs
    }
}
module.exports = AuditLogService;
