const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Review = require("../models/Review");
const { protect } = require("../middleware/authMiddleware");

// @GET /api/reviews/:productId
router.get("/:productId", asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate("user", "name")
    .sort({ createdAt: -1 });
  res.json({ success: true, reviews });
}));

// @POST /api/reviews/:productId  (user)
router.post("/:productId", protect, asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const existing = await Review.findOne({ product: req.params.productId, user: req.user._id });
  if (existing) { res.status(400); throw new Error("You already reviewed this product"); }

  const review = await Review.create({
    product: req.params.productId,
    user: req.user._id,
    rating,
    comment,
  });

  res.status(201).json({ success: true, review });
}));

// @DELETE /api/reviews/:id  (user - own review)
router.delete("/:id", protect, asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) { res.status(404); throw new Error("Review not found"); }
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403); throw new Error("Not authorized");
  }
  await review.remove();
  res.json({ success: true, message: "Review deleted" });
}));

module.exports = router;
