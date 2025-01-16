const AuditLog = require("../models/auditLogs.js");
const File = require("../models/file.js");
exports.auditLogger = (req, res, next) => {
    try {
        let originalJson = res.json;
        res.json = async function (body) {
            if (((req.method == "GET" && Object.keys(req.params).length > 0) || req.method == "POST" || req.method == "PUT") && req.userId) {
                await AuditLog.create({
                    url: req.originalUrl,
                    method: req.method,
                    requestParams: JSON.stringify(req.params),
                    requestBody: JSON.stringify(req.body),
                    response: JSON.stringify(body),
                    userId: req.userId
                });
            }
            return originalJson.call(this, body);
        }
        next();
    } catch (error) {
        console.log("error in logger middleware : ");
        console.log(error);
        next();
    }
}