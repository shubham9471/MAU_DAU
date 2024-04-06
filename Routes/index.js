// const USER_API = require("../Model/user");
// const LOGS_API = require("../Model/logs");

// let allAPIs = [].concat(USER_API, LOGS_API);

// module.exports = allAPIs;

const express = require("express");
const userRoutes = require("./userRoutes");
const logsRoutes = require("./logsRoute");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/logs", logsRoutes);

module.exports = router;
