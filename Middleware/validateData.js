const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res
        .status(401)
        .send({ status: false, msg: "No authentication token" });
    } else {
      let decodedToken = jwt.verify(token, "activity_Data");
      if (decodedToken) {
        req.decodedToken = decodedToken;
        // console.log("Decoded Token", decodedToken);
        // if (!(req.body.email === decodedToken.user.email)) {
        //   return res.status(403).send({
        //     status: false,
        //     message: "Unauthorized access",
        //   });
        // }
        next();
      } else {
        res.status(401).send({ status: false, msg: "Not a valid token" });
      }
    }
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

const validateLoginData = (req, res, next) => {
  // console.log("REACHED HERE MIDDLEWARE====>");
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  next();
};

module.exports = { validateToken, validateLoginData };
