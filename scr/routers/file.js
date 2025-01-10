const router = require("express").Router();
const controller = require("../controllers/file");
const { verifyUserToken, verifyAdminToken } = require("../middleware/auth");
const apiHandler = require("../helpers/wrappers/api-handler");
const upload = require('../helpers/uploadFile');

router.post("/", upload.single("file"), apiHandler(verifyUserToken), apiHandler(controller.add));
router.post("/delete", apiHandler(verifyUserToken), apiHandler(controller.deleteFile));
router.post("/checkIn", apiHandler(verifyUserToken), apiHandler(controller.checkInFile));
router.post("/checkOut", upload.single("file"), apiHandler(verifyUserToken), apiHandler(controller.checkOutFile));
router.post("/userStatistics", apiHandler(verifyUserToken), apiHandler(controller.userStatistics));
router.post("/userStatisticsAsCSV", apiHandler(verifyUserToken), apiHandler(controller.writeUserStatsToCSV));

router.get("/UploadRequists", apiHandler(verifyUserToken), apiHandler(controller.getFileUploadRequists));
router.get("/accept/:groupFileId", apiHandler(verifyUserToken), apiHandler(controller.acceptFile));
router.get("/decline/:groupFileId", apiHandler(verifyUserToken), apiHandler(controller.declineFile));
router.get("/all", apiHandler(controller.allFiles));
router.get("/fileStatistics/:fileId", apiHandler(controller.fileStatistics));
router.get("/fileStatisticsAsCSV/:fileId", apiHandler(controller.writeFileStatsToCSV));
router.get("/filePath/:fileId", apiHandler(controller.getFilePath));

module.exports = router;
