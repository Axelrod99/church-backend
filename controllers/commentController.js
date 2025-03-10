const Comment  = require("../models/commentModal");

const createComment = async (req, res) => {
  try {
    const newComment = req.body;

    const comment = await Comment.create({ ...newComment});
    res.status(200).json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllComment = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getAllComment,
};
