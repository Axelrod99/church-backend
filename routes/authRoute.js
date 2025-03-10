const express = require("express");
const { AuthRegister } = require("../controllers/authController");

const router = express.Router();

router.route("/").get((req, res) => res.send("this is the auth route...."));
router.post("/Register", AuthRegister);

module.exports = router;
