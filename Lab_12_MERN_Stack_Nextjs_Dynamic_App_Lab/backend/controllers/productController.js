const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");
const asyncHandler = require("../middleware/asyncHandler");
const slugify = require("../utils/slugify");

const buildUniqueSlug = async (title, currentId = null) => {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const found = await Product.findOne({ slug });
    if (!found || found._id.toString() === currentId) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

const resolveCategoryId = async (categoryInput) => {
  if (!categoryInput) {
    return null;
  }

  if (mongoose.Types.ObjectId.isValid(categoryInput)) {
    return categoryInput;
  }

  const category = await Category.findOne({ slug: categoryInput });
  return category ? category._id : null;
};

const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Math.min(60, Number(req.query.limit) || 12));
  const skip = (page - 1) * limit;

  const search = (req.query.search || "").trim();
  const tag = (req.query.tag || "").trim().toLowerCase();
  const sort = req.query.sort || "latest";

  const filter = {};

  if (search) {
    filter.$text = { $search: search };
  }

  if (tag) {
    filter.tags = tag;
  }

  if (req.query.category) {
    const categoryId = await resolveCategoryId(req.query.category);
    if (categoryId) {
      filter.category = categoryId;
    } else {
      res.json({
        items: [],
        pagination: {
          page,
          limit,
          totalItems: 0,
          totalPages: 0,
        },
      });
      return;
    }
  }

  let sortQuery = { createdAt: -1 };
  if (sort === "price_asc") sortQuery = { price: 1 };
  if (sort === "price_desc") sortQuery = { price: -1 };
  if (sort === "name_asc") sortQuery = { title: 1 };
  if (sort === "name_desc") sortQuery = { title: -1 };

  const [items, totalItems] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sortQuery)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
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

const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate(
    "category",
    "name slug"
  );

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
});

const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(4)
    .sort({ createdAt: -1 })
    .populate("category", "name slug");

  res.json(related);
});

const getSpotlightGroups = asyncHandler(async (_req, res) => {
  const [featured, special, popular] = await Promise.all([
    Product.find({ tags: "featured" })
      .limit(4)
      .sort({ createdAt: -1 })
      .populate("category", "name slug"),
    Product.find({ tags: "special" })
      .limit(4)
      .sort({ createdAt: -1 })
      .populate("category", "name slug"),
    Product.find({ tags: "popular" })
      .limit(4)
      .sort({ createdAt: -1 })
      .populate("category", "name slug"),
  ]);

  res.json({
    featured,
    special,
    popular,
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    shortDescription,
    description,
    price,
    compareAtPrice,
    image,
    gallery,
    category,
    stock,
    tags,
    badge,
    rating,
    reviewCount,
    specifications,
  } = req.body;

  if (!title || !image || !category || Number(price) < 0) {
    res.status(400);
    throw new Error("title, image, category and valid price are required");
  }

  const categoryId = await resolveCategoryId(category);
  if (!categoryId) {
    res.status(400);
    throw new Error("Invalid category");
  }

  const slug = await buildUniqueSlug(title);

  const product = await Product.create({
    title,
    slug,
    shortDescription: shortDescription || "",
    description: description || "",
    price: Number(price),
    compareAtPrice: Number(compareAtPrice) || 0,
    image,
    gallery: Array.isArray(gallery) ? gallery : [],
    category: categoryId,
    stock: Number(stock) || 0,
    tags: Array.isArray(tags) ? tags : [],
    badge: badge || "",
    rating: Number(rating) || 0,
    reviewCount: Number(reviewCount) || 0,
    specifications: Array.isArray(specifications) ? specifications : [],
  });

  const populated = await Product.findById(product._id).populate("category", "name slug");
  res.status(201).json(populated);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (req.body.title && req.body.title !== product.title) {
    product.title = req.body.title;
    product.slug = await buildUniqueSlug(req.body.title, product._id.toString());
  }

  if (req.body.category) {
    const categoryId = await resolveCategoryId(req.body.category);
    if (!categoryId) {
      res.status(400);
      throw new Error("Invalid category");
    }
    product.category = categoryId;
  }

  product.shortDescription = req.body.shortDescription ?? product.shortDescription;
  product.description = req.body.description ?? product.description;
  if (req.body.price !== undefined) product.price = Number(req.body.price);
  if (req.body.compareAtPrice !== undefined) {
    product.compareAtPrice = Number(req.body.compareAtPrice);
  }
  product.image = req.body.image ?? product.image;
  if (Array.isArray(req.body.gallery)) product.gallery = req.body.gallery;
  if (req.body.stock !== undefined) product.stock = Number(req.body.stock);
  if (Array.isArray(req.body.tags)) product.tags = req.body.tags;
  product.badge = req.body.badge ?? product.badge;
  if (req.body.rating !== undefined) product.rating = Number(req.body.rating);
  if (req.body.reviewCount !== undefined) {
    product.reviewCount = Number(req.body.reviewCount);
  }
  if (Array.isArray(req.body.specifications)) {
    product.specifications = req.body.specifications;
  }

  const updated = await product.save();
  const populated = await Product.findById(updated._id).populate("category", "name slug");
  res.json(populated);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ message: "Product deleted successfully" });
});

module.exports = {
  getProducts,
  getProductBySlug,
  getRelatedProducts,
  getSpotlightGroups,
  createProduct,
  updateProduct,
  deleteProduct,
};
