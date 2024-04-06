const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const Middleware = require("../Middleware/validateData");

router.post(
  "/register",
  Middleware.validateLoginData,
  userController.registerUser
);
router.post(
  "/login",
  Middleware.validateToken,
  Middleware.validateLoginData,
  userController.loginUser
);
router.post("/logout", userController.logoutUser);

module.exports = router;
