const mongoose = require("mongoose");
const Message = require("./models/Message");
const dotenv = require("dotenv");
dotenv.config();

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const m = await Message.create({
    name: "Test User",
    email: "test@example.com",
    subject: "Help",
    message: "Does it work?"
  });
  console.log("Created:", m.status);

  // reply
  m.status = "replied";
  m.replyMessage = "Yes it works";
  await m.save();
  console.log("Replied:", m.status, m.replyMessage);

  // fetch
  const fetched = await Message.findById(m._id);
  console.log("Fetched from DB:", fetched.status, fetched.replyMessage);

  process.exit();
}

test();
