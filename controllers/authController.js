const User = require("../models/userModal");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

function generateNumberCode(length) {
    let result = "";
    const characters = "0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

const AuthRegister = async (req, res, next) => {
  const { email } = req.body;

  try {
    const VerificationToken = generateNumberCode(6);

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
