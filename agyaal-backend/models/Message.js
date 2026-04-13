const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
    },
    replyMessage: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
