const express = require("express");
const {
    createPost,
    getAllPosts,
    createComment,
    getAllComment,
    getPostComments,
    deletePost
} = require("../controllers/postController");

const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); 
  },
});

const upload = multer({ storage });

router.route("/").get((req, res) => res.send("this is the posts route...."));


router.post("/createPost", upload.single("image"), createPost);
router.get("/all", getAllPosts);
router.patch("/createComment/:id", createComment);
router.get("/all", getAllComment);
router.get("/comment/:id", getPostComments);
router.delete('/:id', deletePost); 

module.exports = router;