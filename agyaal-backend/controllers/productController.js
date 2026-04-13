const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

// @GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { category, ageGroup, minPrice, maxPrice, search, featured, page = 1, limit = 12 } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (ageGroup) filter.ageGroup = ageGroup;
  if (featured) filter.isFeatured = true;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) filter.name = { $regex: search, $options: "i" };

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate("category", "name slug")
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  res.json({ success: true, total, page: Number(page), products });
});

// @GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category", "name slug");
  if (!product) { res.status(404); throw new Error("Product not found"); }
  res.json({ success: true, product });
});

// @POST /api/products  (admin)
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, discountPrice, category, sizes, ageGroup, stock, isFeatured } = req.body;
  const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

  const product = await Product.create({
    name, description, category, ageGroup,
    price: price ? Number(price) : 0,
    discountPrice: discountPrice ? Number(discountPrice) : null,
    stock: stock ? Number(stock) : 0,
    isFeatured: isFeatured === "true" || isFeatured === true,
    images, sizes: sizes ? JSON.parse(sizes) : [],
  });

  res.status(201).json({ success: true, product });
});

// @PUT /api/products/:id  (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error("Product not found"); }

  const { name, description, price, discountPrice, category, sizes, ageGroup, stock, isFeatured } = req.body;
  product.name = name || product.name;
  product.description = description || product.description;
  if (price !== undefined) product.price = price ? Number(price) : 0;
  if (discountPrice !== undefined) product.discountPrice = discountPrice ? Number(discountPrice) : null;
  product.category = category || product.category;
  if (sizes) product.sizes = JSON.parse(sizes);
  product.ageGroup = ageGroup || product.ageGroup;
  if (stock !== undefined) product.stock = stock ? Number(stock) : 0;
  if (isFeatured !== undefined) product.isFeatured = isFeatured === "true" || isFeatured === true;
  if (req.files && req.files.length > 0) product.images = req.files.map((f) => `/uploads/${f.filename}`);

  const updated = await product.save();
  res.json({ success: true, product: updated });
});

// @DELETE /api/products/:id  (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) { res.status(404); throw new Error("Product not found"); }
  res.json({ success: true, message: "Product deleted" });
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };