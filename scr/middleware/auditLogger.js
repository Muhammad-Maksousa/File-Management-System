const AuditLog = require("../models/auditLogs.js");
const File = require("../models/file.js");
exports.auditLogger = (req, res, next) => {
    try {
        let originalJson = res.json;
        res.json = async function (body) {
            /*console.log("inside");
            console.log(JSON.stringify(req.method));
            console.log(JSON.stringify(req.url));
             console.log(req.params);
             console.log(req.query);
             console.log(req.body);
            console.log(JSON.stringify(req.userId));
            console.log("--------------");
            console.log(JSON.stringify(body.data));
            console.log("--------------------");*/
            return originalJson.call(this,body);
        }
        next();
    } catch (error) {
        console.log("error in logger middleware : ");
        console.log(error);
        next();
    }
}