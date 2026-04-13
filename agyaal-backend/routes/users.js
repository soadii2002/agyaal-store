const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// @GET /api/users  (admin)
router.get("/", protect, adminOnly, asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ success: true, users });
}));

// @GET /api/users/:id  (admin)
router.get("/:id", protect, adminOnly, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) { res.status(404); throw new Error("User not found"); }
  res.json({ success: true, user });
}));

// @PUT /api/users/:id/role  (admin) - promote/demote
router.put("/:id/role", protect, adminOnly, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error("User not found"); }
  user.role = req.body.role === "admin" ? "admin" : "user";
  await user.save();
  res.json({ success: true, message: `User role updated to ${user.role}` });
}));

// @DELETE /api/users/:id  (admin)
router.delete("/:id", protect, adminOnly, asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "User deleted" });
}));

module.exports = router;
