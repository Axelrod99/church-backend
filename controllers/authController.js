const User = require("../models/userModal");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

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

    const emailFields = {
      to: user.email,
      subject: "Confirm your email address",
      text: `Your verification code is: ${VerificationToken}`,
    };

    await sendEmail({ ...emailFields });

    res.status(200).json({
      status: "success",
      data: {
        user: user,
        VerificationToken: VerificationToken,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const adminSignup = async (req, res, next) => {
  const { email } = req.body;

  const user = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser)
    return res.status(400).json({
      status: "failed",
      data: [],
      message: "It seems you already have an account, please log in instead.",
    });

  const VerificationToken = generateNumberCode(6);

  try {
    // const emailFields = {
    //   to: user.email,
    //   subject: "Confirm your email address",
    //   text: `Your verification code is: ${VerificationToken}`,
    // };

    // await sendEmail({ ...emailFields });

    res.status(200).json({
      status: "success",
      data: {
        user: user,
        VerificationToken: VerificationToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const adminRegister = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = new User({
      email,
      password,
    });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        status: "failed",
        data: [],
        message: "It seems you already have an account, please log in instead.",
      });

    const dataTosave = await user.save();

    let options = {
      maxAge: 20 * 60 * 1000,
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

module.exports = { AuthRegister, adminSignup, adminRegister };
