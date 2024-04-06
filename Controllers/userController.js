// userController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Model/user");
const logController = require("../Controllers/logsController");
const userService = require("../Services/userService");

const registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  try {
    // Check if email is provided and valid
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    // Check if email is already used
    let user = await userService.findUserByEmail(email);

    if (user > 0) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    // Create user
    userData = new User({
      email,
      password,
      name,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(password, salt);
    console.log("HERE", userData);
    await userService.createUser(userData);
    console.log("USER DATA", userData);
    // Create and return token
    const payload = {
      user: {
        id: user.id,
        email: user.email,
      },
    };

    // jwt.sign(
    //   payload,
    //   process.env.JWT_SECRET,
    //   { expiresIn: 3600 }, // Expires in 1 hour
    //   (err, token) => {
    //     if (err) throw err;
    //     res.json({ token });
    //   }
    // );
    let token = await jwt.sign(
      payload,

      "activity_Data",
      { expiresIn: "100hr" }
    );

    res.header("x-api-key", token);
    res.status(200).send({
      status: true,
      message: `User registered in successfully`,
      data: { token },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await userService.findOne(email);
    if (!user) {
      return res.status(400).json({ msg: "Invalid email. Please register" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // Call logLogin function and pass userId
    try {
      await logController.createUserLog(user.id);
      console.log("Created user log successfully");
    } catch (error) {
      console.error("Error logging login:", error);
    }

    // Create and return token
    const payload = {
      user: {
        id: user.id,
        email: user.email,
      },
    };

    // jwt.sign(
    //   payload,
    //   process.env.JWT_SECRET,
    //   { expiresIn: 3600 }, // Expires in 1 hour
    //   (err, token) => {
    //     if (err) {
    //       console.error("Error generating token:", err);
    //       return res.status(500).send("Server Error");
    //     }

    //     res.json({ token });
    //   }
    // );
    let token = await jwt.sign(
      payload,

      "activity_Data",
      { expiresIn: "100hr" }
    );
    res.status(200).send({
      status: true,
      message: `User loggedIn in successfully`,
      token,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const logoutUser = async (req, res) => {
  // Implement logout logic if needed
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
