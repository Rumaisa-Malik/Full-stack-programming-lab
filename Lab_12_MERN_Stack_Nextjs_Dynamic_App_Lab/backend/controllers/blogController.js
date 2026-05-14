const BlogPost = require("../models/BlogPost");
const asyncHandler = require("../middleware/asyncHandler");
const slugify = require("../utils/slugify");

const buildUniqueSlug = async (title, currentId = null) => {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const found = await BlogPost.findOne({ slug });
    if (!found || found._id.toString() === currentId) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

const getPosts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Math.min(30, Number(req.query.limit) || 6));
  const skip = (page - 1) * limit;
  const search = (req.query.search || "").trim();

  const filter = {};
  if (req.query.published !== "0") {
    filter.isPublished = true;
  }
  if (search) {
    filter.$text = { $search: search };
  }

  const [items, totalItems] = await Promise.all([
    BlogPost.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(limit),
    BlogPost.countDocuments(filter),
  ]);

  res.json({
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  });
});

const getPostBySlug = asyncHandler(async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug });

  if (!post) {
    res.status(404);
    throw new Error("Blog post not found");
  }

  res.json(post);
});

const createPost = asyncHandler(async (req, res) => {
  const { title, excerpt, content, coverImage, tags, author, isPublished } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Blog title is required");
  }

  const slug = await buildUniqueSlug(title);

  const post = await BlogPost.create({
    title,
    slug,
    excerpt: excerpt || "",
    content: content || "",
    coverImage: coverImage || "",
    tags: Array.isArray(tags) ? tags : [],
    author: author || "Rustik Plank Team",
    isPublished: isPublished !== false,
    publishedAt: new Date(),
  });

  res.status(201).json(post);
});

const updatePost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Blog post not found");
  }

  if (req.body.title && req.body.title !== post.title) {
    post.title = req.body.title;
    post.slug = await buildUniqueSlug(req.body.title, post._id.toString());
  }

  post.excerpt = req.body.excerpt ?? post.excerpt;
  post.content = req.body.content ?? post.content;
  post.coverImage = req.body.coverImage ?? post.coverImage;
  if (Array.isArray(req.body.tags)) post.tags = req.body.tags;
  post.author = req.body.author ?? post.author;
  if (typeof req.body.isPublished === "boolean") {
    post.isPublished = req.body.isPublished;
  }

  const updated = await post.save();
  res.json(updated);
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Blog post not found");
  }

  await post.deleteOne();
  res.json({ message: "Blog post deleted successfully" });
});

module.exports = {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
};
