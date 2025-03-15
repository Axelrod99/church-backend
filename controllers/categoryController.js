const Category = require("../models/categoryModal");
const cloudinary = require("../utils/cloudinary");

const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const newCategory = req.body;
    const file = req.file;

    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.path);
      const imageUrl = uploadResult.secure_url;
      const category = await Category.create({
        ...newCategory,
        image: imageUrl,
      });
      res.status(200).json(category);
    }
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateCategory = async (req, res) => {
  const file = req.file;
  const categoryId = req.params.id;

  try {
    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.path);
      const imageUrl = uploadResult.secure_url;

      const category = await Category.findOneAndUpdate(
        { _id: categoryId },
        { $set: { image: imageUrl } },
        { new: true }
      );

      if (!category) {
        throw new NotFoundError("Category not found");
      }

      res.json({ message: "Category updated successfully", category });
    }
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllCategory,
  createCategory,
  updateCategory
};
