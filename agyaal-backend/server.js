const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Serve uploaded images locally ────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Routes ──────────────────────────────────────────────────
app.use("/api/auth",       require("./routes/auth"));
app.use("/api/products",   require("./routes/products"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/orders",     require("./routes/orders"));
app.use("/api/cart",       require("./routes/cart"));
app.use("/api/users",      require("./routes/users"));
app.use("/api/reviews",    require("./routes/reviews"));
app.use("/api/messages",   require("./routes/messages"));

// ─── Health check ─────────────────────────────────────────────
app.get("/", (req, res) => res.json({ message: "🛍️ Agyaal Store API is running" }));

// ─── Error Handling ───────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));