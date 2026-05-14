const express = require("express");
const {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/blogController");
const { protect, requireAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getPosts);
router.get("/:slug", getPostBySlug);
router.post("/", protect, requireAdmin, createPost);
router.put("/:id", protect, requireAdmin, updatePost);
router.delete("/:id", protect, requireAdmin, deletePost);

module.exports = router;
