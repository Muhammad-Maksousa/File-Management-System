const router = require("express").Router();
const controller = require("../controllers/group");
const { verifyUserToken, verifyAdminToken } = require("../middleware/auth");
const apiHandler = require("../helpers/wrappers/api-handler");
const upload = require('../helpers/uploadGroupImage');

router.post("/",upload.single("image"), apiHandler(verifyUserToken), apiHandler(controller.add));
router.post("/invite", apiHandler(verifyUserToken), apiHandler(controller.sendJoinRequestToMyGroup));
router.post("/block", apiHandler(verifyUserToken), apiHandler(controller.block));
router.post("/unBlock", apiHandler(verifyUserToken), apiHandler(controller.unBlock));
router.post("/restrict", apiHandler(verifyUserToken), apiHandler(controller.restrict));
router.post("/unRestrict", apiHandler(verifyUserToken), apiHandler(controller.unRestrict));

router.put("/:groupId",upload.single("image"), apiHandler(verifyUserToken), apiHandler(controller.update));

router.get("/:groupId",apiHandler(verifyUserToken), apiHandler(controller.getOne));
router.get("/users/:groupId", apiHandler(verifyUserToken), apiHandler(controller.usersOfGroup));


module.exports = router;
