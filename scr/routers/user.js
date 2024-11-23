const router = require("express").Router();
const controller = require("../controllers/user");
const { verifyUserToken, verifyAdminToken } = require("../middleware/auth");
const apiHandler = require("../helpers/wrappers/api-handler");
const upload = require('../helpers/uploadUserImage');

router.post("/", apiHandler(controller.add));//http://localhost:8080/images/users/1732182221593.png
router.post("/login", apiHandler(controller.login));
router.post("/remove", apiHandler(verifyUserToken), apiHandler(controller.removeUserFromMyGroup));

router.put("/", apiHandler(verifyUserToken), apiHandler(controller.update));

router.get("/profile", apiHandler(verifyUserToken), apiHandler(controller.getById));
router.get("/groupInvitations", apiHandler(verifyUserToken), apiHandler(controller.getMyGroupInvitations));
router.get("/myGroups", apiHandler(verifyUserToken), apiHandler(controller.getMyGroups));
router.get("/invitations", apiHandler(verifyUserToken), apiHandler(controller.getMyGroupInvitations));
router.get("/accept/:invitationId", apiHandler(verifyUserToken), apiHandler(controller.acceptGroupInvitation));
router.get("/decline/:invitationId", apiHandler(verifyUserToken), apiHandler(controller.declineGroupInvitation));
router.get("/usersToInvite/:groupId", apiHandler(verifyUserToken), apiHandler(controller.usersToInvite));
router.get("/myOwnGroups", apiHandler(verifyUserToken), apiHandler(controller.getMyOwnGroups));
module.exports = router;
