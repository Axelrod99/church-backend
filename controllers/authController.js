const User = require("../models/userModal");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const AuthRegister = async (req, res, next) => {
  const { email } = req.body;

  try {
    const VerificationToken = crypto.randomBytes(8).toString("hex");

    const user = new User({
      email,
      VerificationToken,
    });

    let options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    const token = user.generateAccessJWT();
    res.cookie("SessionID", token, options);

    res.status(200).json({
      status: "success",
      data: {
        user: user,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { AuthRegister };
