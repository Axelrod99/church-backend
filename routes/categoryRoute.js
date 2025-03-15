const express = require("express");
const {
  createCategory,
  getAllCategory,
  updateCategory,
  filterCategory
} = require("../controllers/categoryController");

const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.route("/").get((req, res) => res.send("this is the category route...."));

router.get("/all", getAllCategory);
router.get("/:category", filterCategory);
router.post("/createCategory", upload.single("image"), createCategory);
router.patch("/updateCategory/:id", upload.single("image"), updateCategory);

module.exports = router;
