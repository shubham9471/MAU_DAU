// LoginLog.js
const mongoose = require("mongoose");

const loginLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  loginTime: { type: Date, default: Date.now, index: true },
  createdAt: { type: Date }, // Adding createdAt field
});

module.exports = mongoose.model("LoginLog", loginLogSchema);
