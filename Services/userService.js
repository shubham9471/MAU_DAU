// userService.js
const User = require("../Model/user");

const findUserByEmail = async (email) => {
  try {
    const count = await User.countDocuments({ email });
    return count;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createUser = async ({ email, password, name }) => {
  try {
    const user = new User({ email, password, name });
    return await user.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const findOne = async (emailId) => {
  try {
    const user = await User.findOne({ email: emailId });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  findUserByEmail,
  createUser,
  findOne,
};
