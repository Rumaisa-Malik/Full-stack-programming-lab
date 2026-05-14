const Category = require("../models/Category");
const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");
const slugify = require("../utils/slugify");

const buildUniqueSlug = async (name, currentId = null) => {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const found = await Category.findOne({ slug });
    if (!found || found._id.toString() === currentId) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).lean();

  if (req.query.withCounts === "1") {
    const counts = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((item) => [String(item._id), item.count]));

    const enriched = categories.map((category) => ({
      ...category,
      productCount: countMap.get(String(category._id)) || 0,
    }));

    res.json(enriched);
    return;
  }

  res.json(categories);
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  res.json(category);
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image, cardImage, isFeatured } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const slug = await buildUniqueSlug(name);

  const category = await Category.create({
    name,
    slug,
    description: description || "",
    image: image || "",
    cardImage: cardImage || "",
    isFeatured: Boolean(isFeatured),
  });

  res.status(201).json(category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  if (req.body.name && req.body.name !== category.name) {
    category.slug = await buildUniqueSlug(req.body.name, category._id.toString());
    category.name = req.body.name;
  }

  category.description = req.body.description ?? category.description;
  category.image = req.body.image ?? category.image;
  category.cardImage = req.body.cardImage ?? category.cardImage;
  if (typeof req.body.isFeatured === "boolean") {
    category.isFeatured = req.body.isFeatured;
  }

  const updated = await category.save();
  res.json(updated);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const productsUsingCategory = await Product.countDocuments({ category: category._id });
  if (productsUsingCategory > 0) {
    res.status(400);
    throw new Error("Cannot delete category while products are linked to it");
  }

  await category.deleteOne();
  res.json({ message: "Category deleted successfully" });
});

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
