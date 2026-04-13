const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @POST /api/orders  (user)
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, notes } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
  if (!cart || cart.items.length === 0) {
    res.status(400); throw new Error("Cart is empty");
  }

  const SHIPPING_FEE = 50; // EGP - can be dynamic later
const items = cart.items.map((item) => ({
  product: item.product._id,
  name: item.product.name,
  image: item.product.images && item.product.images.length > 0
        ? item.product.images[0]
        : '',
  quantity: item.quantity,
  size: item.size,
  price: item.price,
}));

  const totalPrice = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0) + SHIPPING_FEE;

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod: paymentMethod || "cash_on_delivery",
    totalPrice,
    shippingFee: SHIPPING_FEE,
    notes,
  });

  // Reduce stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
  }

  // Clear cart
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(201).json({ success: true, order });
});

// @GET /api/orders/myorders  (user)
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @GET /api/orders/:id  (user - own order / admin)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) { res.status(404); throw new Error("Order not found"); }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403); throw new Error("Not authorized");
  }
  res.json({ success: true, order });
});

// @GET /api/orders  (admin)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @PUT /api/orders/:id/status  (admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Order not found"); }

  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  const updated = await order.save();
  res.json({ success: true, order: updated });
});

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
