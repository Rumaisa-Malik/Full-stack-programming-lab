const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");

const createOrder = asyncHandler(async (req, res) => {
  const { customer, items, shippingFee = 0, paymentMethod } = req.body;

  if (!customer || !customer.name || !customer.email || !customer.address) {
    res.status(400);
    throw new Error("Customer details are incomplete");
  }

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("Order requires at least one item");
  }

  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      res.status(400);
      throw new Error(`Product not found: ${item.productId}`);
    }

    const quantity = Math.max(1, Number(item.quantity) || 1);
    const lineTotal = Number((product.price * quantity).toFixed(2));

    if (product.stock < quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.title}`);
    }

    product.stock -= quantity;
    await product.save();

    subtotal += lineTotal;
    orderItems.push({
      product: product._id,
      title: product.title,
      image: product.image,
      quantity,
      unitPrice: product.price,
      lineTotal,
    });
  }

  const order = await Order.create({
    customer,
    items: orderItems,
    subtotal: Number(subtotal.toFixed(2)),
    shippingFee: Number(shippingFee) || 0,
    total: Number((subtotal + (Number(shippingFee) || 0)).toFixed(2)),
    paymentMethod: paymentMethod || "Cash on Delivery",
    status: "pending",
  });

  res.status(201).json(order);
});

const getOrders = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.email) {
    filter["customer.email"] = req.query.email.toLowerCase();
  }

  const orders = await Order.find(filter).sort({ createdAt: -1 }).populate({
    path: "items.product",
    select: "slug",
  });

  res.json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate({
    path: "items.product",
    select: "slug",
  });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(order);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (!req.body.status) {
    res.status(400);
    throw new Error("status is required");
  }

  order.status = req.body.status;
  const updated = await order.save();
  res.json(updated);
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  await order.deleteOne();
  res.json({ message: "Order deleted successfully" });
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
