const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

// @GET /api/categories
router.get("/", asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json({ success: true, categories });
}));

// @GET /api/categories/:id
router.get("/:id", asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) { res.status(404); throw new Error("Category not found"); }
  res.json({ success: true, category });
}));

// @POST /api/categories  (admin)
router.post("/", protect, adminOnly, upload.single("image"), asyncHandler(async (req, res) => {
  const { name, slug } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : "";
  const category = await Category.create({ name, slug, image });
  res.status(201).json({ success: true, category });
}));

// @PUT /api/categories/:id  (admin)
router.put("/:id", protect, adminOnly, upload.single("image"), asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) { res.status(404); throw new Error("Category not found"); }
  category.name = req.body.name || category.name;
  category.slug = req.body.slug || category.slug;
  if (req.file) category.image = `/uploads/${req.file.filename}`;
  const updated = await category.save();
  res.json({ success: true, category: updated });
}));

// @DELETE /api/categories/:id  (admin)
router.delete("/:id", protect, adminOnly, asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Category deleted" });
}));

module.exports = router;