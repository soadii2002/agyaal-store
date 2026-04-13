const Message = require("../models/Message");

// @desc    Create a new message
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "يرجى ملء الحقول المطلوبة" });
    }

    const newMessage = await Message.create({ name, email, subject, message });
    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء إرسال الرسالة", error: error.message });
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب الرسائل", error: error.message });
  }
};

// @desc    Reply to a message
// @route   PUT /api/messages/:id/reply
// @access  Private/Admin
const replyMessage = async (req, res) => {
  try {
    const { replyText } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "الرسالة غير موجودة" });
    }

    message.status = "replied";
    message.replyMessage = replyText;
    await message.save();

    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء الرد على الرسالة", error: error.message });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "الرسالة غير موجودة" });
    }

    await message.deleteOne();
    res.json({ success: true, message: "تم حذف الرسالة بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء حذف الرسالة", error: error.message });
  }
};

// @desc    Get logged in user's messages
// @route   GET /api/messages/my-messages
// @access  Private
const getMyMessages = async (req, res) => {
  try {
    const messages = await Message.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب الرسائل", error: error.message });
  }
};

module.exports = { createMessage, getMessages, getMyMessages, replyMessage, deleteMessage };
