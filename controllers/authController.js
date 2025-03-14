const User = require("../models/userModal");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
      status: 'User'
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
      status: 'Admin'
    });
  } catch (error) {
    next(error);
  }
};

const adminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        status: "failed",
        data: [],
        message: "No user found with this email. Please try again.",
      });
    }

    // Plain-text password comparison (INSECURE - DO NOT USE IN PRODUCTION)
    if (password === user.password) {
      // console.log("Passwords match! (INSECURE)");

      const options = {
        maxAge: 20 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "None",
      };

      const userObject = user.toObject();
      delete userObject.password;

      const token = user.generateAccessJWT();
      res.cookie("SessionID", token, options);
    

      return res.status(200).json({
        status: "success",
        data: [userObject],
        message: "You have successfully logged in.",
        token: token,
        status: 'Admin'
      });
    } else {
      console.log("Passwords do not match.");
      return res.status(401).json({
        status: "failed",
        data: [],
        message: "Invalid email or password. Please try again.",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
  }
};

module.exports = { AuthRegister, adminSignup, adminRegister, adminLogin };
