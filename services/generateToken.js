const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, "thiswillbesecret", { expiresIn: "2d" });
};

module.exports = generateToken;
