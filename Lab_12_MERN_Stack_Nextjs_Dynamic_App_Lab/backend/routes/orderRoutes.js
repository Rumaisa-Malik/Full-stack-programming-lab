const express = require("express");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const { protect, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createOrder);
router.get("/", protect, requireAdmin, getOrders);
router.get("/:id", protect, requireAdmin, getOrderById);
router.patch("/:id/status", protect, requireAdmin, updateOrderStatus);
router.delete("/:id", protect, requireAdmin, deleteOrder);

module.exports = router;
