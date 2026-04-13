const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessages,
  getMyMessages,
  replyMessage,
  deleteMessage,
} = require("../controllers/messageController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.route("/my-messages")
  .get(protect, getMyMessages);

router.route("/")
  .post(createMessage)
  .get(protect, adminOnly, getMessages);

router.route("/:id/reply")
  .put(protect, adminOnly, replyMessage);

router.route("/:id")
  .delete(protect, adminOnly, deleteMessage);

module.exports = router;
