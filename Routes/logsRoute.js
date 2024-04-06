// logRoutes.js
const express = require("express");
const router = express.Router();
const logController = require("../Controllers/logsController");

router.get("/dau-mau", logController.getDauAndMau);

module.exports = router;
