const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @GET /api/cart  (user)
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product", "name images price stock");
  res.json({ success: true, cart: cart || { items: [] } });
});

// @POST /api/cart  (user) - add item
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, size } = req.body;

  const product = await Product.findById(productId);
  if (!product) { res.status(404); throw new Error("Product not found"); }
  if (product.stock < quantity) { res.status(400); throw new Error("Not enough stock"); }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const existingItem = cart.items.find(
    (i) => i.product.toString() === productId && i.size === size
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, size, price: product.discountPrice || product.price });
  }

  await cart.save();
  res.json({ success: true, cart });
});

// @PUT /api/cart/:itemId  (user) - update quantity
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error("Cart not found"); }

  const item = cart.items.id(req.params.itemId);
  if (!item) { res.status(404); throw new Error("Item not found"); }

  if (quantity <= 0) {
    item.remove();
  } else {
    item.quantity = quantity;
  }

  await cart.save();
  res.json({ success: true, cart });
});

// @DELETE /api/cart/:itemId  (user)
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error("Cart not found"); }

  cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
  await cart.save();
  res.json({ success: true, cart });
});

// @DELETE /api/cart  (user) - clear entire cart
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.json({ success: true, message: "Cart cleared" });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
