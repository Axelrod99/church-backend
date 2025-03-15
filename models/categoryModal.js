const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    image: {
      type: [],
    },
    category: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
