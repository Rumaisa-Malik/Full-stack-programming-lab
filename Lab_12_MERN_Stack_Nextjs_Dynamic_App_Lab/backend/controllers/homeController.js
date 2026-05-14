const Category = require("../models/Category");
const Product = require("../models/Product");
const BlogPost = require("../models/BlogPost");
const asyncHandler = require("../middleware/asyncHandler");
const { homeContent } = require("../utils/seedData");

const getHomeData = asyncHandler(async (_req, res) => {
  const [categories, featured, special, popular, latestPosts] = await Promise.all([
    Category.find({ isFeatured: true }).sort({ createdAt: 1 }).limit(3),
    Product.find({ tags: "featured" })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("category", "name slug"),
    Product.find({ tags: "special" })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("category", "name slug"),
    Product.find({ tags: "popular" })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("category", "name slug"),
    BlogPost.find({ isPublished: true }).sort({ publishedAt: -1 }).limit(3),
  ]);

  res.json({
    hero: homeContent.hero,
    categories,
    spotlight: {
      featured,
      special,
      popular,
    },
    hotDeals: homeContent.hotDeals,
    buyStripImage: homeContent.buyStripImage,
    partnerStripImage: homeContent.partnerStripImage,
    latestPosts,
  });
});

module.exports = {
  getHomeData,
};
