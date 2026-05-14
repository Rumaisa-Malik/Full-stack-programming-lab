const express = require("express");
const {
  getProducts,
  getProductBySlug,
  getRelatedProducts,
  getSpotlightGroups,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getProducts);
router.get("/groups/spotlight", getSpotlightGroups);
router.get("/slug/:slug/related", getRelatedProducts);
router.get("/slug/:slug", getProductBySlug);
router.post("/", protect, requireAdmin, createProduct);
router.put("/:id", protect, requireAdmin, updateProduct);
router.delete("/:id", protect, requireAdmin, deleteProduct);

module.exports = router;
