const express = require("express");
const {
  createComment,
  getAllComment,
} = require("../controllers/commentController");

const router = express.Router();

router.route("/").get((req, res) => res.send("this is the comment route...."));

router.post("/createComment", createComment);
router.get("/all", getAllComment);

module.exports = router;
