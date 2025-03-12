const express = require("express");
const {
  AuthRegister,
  adminSignup,
  adminRegister,
} = require("../controllers/authController");

const router = express.Router();

router.route("/").get((req, res) => res.send("this is the auth route...."));
router.post("/Register", AuthRegister);

router.post("/AdminSignup", adminSignup);
router.post("/AdminRegister", adminRegister);

module.exports = router;
