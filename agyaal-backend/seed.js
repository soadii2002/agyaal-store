/**
 * Run with:  node seed.js
 * Seeds: 1 admin user + 6 categories
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");
const Category = require("./models/Category");

const categories = [
  { name: "ملابس يومية",        slug: "daily" },
  { name: "مناسبات خاصة",       slug: "special-occasions" },
  { name: "ملابس رياضية",        slug: "sportswear" },
  { name: "ملابس شتوية",         slug: "winter" },
  { name: "ملابس صيفية",         slug: "summer" },
  { name: "طقم وبدل",            slug: "sets-suits" },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing
    await User.deleteMany({});
    await Category.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create admin
    await User.create({
      name: "Admin Agyaal",
      email: "admin@agyaal.com",
      password: "admin123456",
      role: "admin",
    });
    console.log("👤 Admin created  →  admin@agyaal.com / admin123456");

    // Create categories
    await Category.insertMany(categories);
    console.log(`🏷️  ${categories.length} categories created`);

    console.log("\n✅ Seed complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err.message);
    process.exit(1);
  }
};

seedDB();
