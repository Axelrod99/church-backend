const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "It must have an email"],
    },
    password: {
      type: String,
    },
    VerificationToken: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Admin",
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAccessJWT = function () {
  let payload = {
    id: this._id,
  };

  return jwt.sign(payload, process.env.MONGODB_URI);
};

module.exports = mongoose.model("User", userSchema);
