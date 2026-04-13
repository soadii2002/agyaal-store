const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

// One review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// After save/delete: recalculate product rating
reviewSchema.statics.calcAverageRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const Product = require("./Product");
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      "ratings.average": Math.round(stats[0].avg * 10) / 10,
      "ratings.count": stats[0].count,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      "ratings.average": 0,
      "ratings.count": 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRating(this.product);
});

reviewSchema.post("remove", function () {
  this.constructor.calcAverageRating(this.product);
});

module.exports = mongoose.model("Review", reviewSchema);
