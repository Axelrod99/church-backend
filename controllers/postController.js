const { Post, Comment } = require("../models/commentModal");
const cloudinary = require("../utils/cloudinary");

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const newPost = req.body;
    const file = req.file;

    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.path);
      const imageUrl = uploadResult.secure_url;
      const post = await Post.create({
        ...newPost,
        image: imageUrl,
      });
      res.status(200).json(post);
    }
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createComment = async (req, res) => {
  const postId = req.params.id;
  const content = req.body.content;
  const email = req.body.email;

  try {
    const post = await Post.findOne({ _id: req.params.id });

    const newComment = new Comment({
      content: content,
      post: postId,
      email: email,
    });
    post.comments.push(newComment);
    await newComment.save();

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const getPostComments = async (req, res) => {
  try {
    const postId = req.params.id;

    const posts = await Comment.find({ post: postId });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error getting user post:", error);
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
  

const deletePost = async (req, res) => {
  try {
    const ids = req.params.id;

    const post = await Post.findById(ids);

    if (!post) {
      return res.status(404).json({ message: `No post found with id ${ids}` });
    }

    const data = await Post.findByIdAndDelete(ids);
    res.send(`post has been deleted`);
    res.status(200).json();
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  createComment,
  getPostComments,
  deletePost,
  getAllComment
};
