const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: null },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    images: [{ type: String }],
    sizes: [{ type: String }],         // e.g. ["3M","6M","1Y","2Y","3Y"]
    ageGroup: { type: String, default: "" }, // e.g. "0-12 months"
    stock: { type: Number, required: true, default: 0 },
    isFeatured: { type: Boolean, default: false },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
