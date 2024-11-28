const router = require("express").Router();
const controller = require("../controllers/file");
const { verifyUserToken, verifyAdminToken } = require("../middleware/auth");
const apiHandler = require("../helpers/wrappers/api-handler");
const upload = require('../helpers/uploadFile');

router.post("/",upload.single("file"), apiHandler(verifyUserToken), apiHandler(controller.add));


module.exports = router;
