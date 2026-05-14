const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const Category = require("./models/Category");
const Product = require("./models/Product");
const BlogPost = require("./models/BlogPost");
const Order = require("./models/Order");
const { categories, products, blogPosts } = require("./utils/seedData");

dotenv.config();

const runSeed = async () => {
  try {
    await connectDB();

    await Promise.all([
      Order.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      BlogPost.deleteMany({}),
      User.deleteMany({}),
    ]);

    const createdCategories = await Category.insertMany(categories);
    const categoryMap = new Map(createdCategories.map((item) => [item.slug, item._id]));

    const preparedProducts = products.map((product) => {
      const categoryId = categoryMap.get(product.categorySlug);
      if (!categoryId) {
        throw new Error(`Unknown category slug in seed data: ${product.categorySlug}`);
      }

      return {
        ...product,
        category: categoryId,
        categorySlug: undefined,
      };
    });

    const cleanedProducts = preparedProducts.map(({ categorySlug, ...rest }) => rest);

    const createdProducts = await Product.insertMany(cleanedProducts);
    const createdPosts = await BlogPost.insertMany(blogPosts);

    const admin = await User.create({
      name: "Rustik Admin",
      email: "admin@rustikplank.com",
      password: "admin123",
      role: "admin",
    });

    const customer = await User.create({
      name: "Demo Customer",
      email: "customer@rustikplank.com",
      password: "customer123",
      role: "customer",
    });

    console.log("Seed completed successfully");
    console.log(`Categories: ${createdCategories.length}`);
    console.log(`Products: ${createdProducts.length}`);
    console.log(`Blog posts: ${createdPosts.length}`);
    console.log(`Users: 2 (${admin.email}, ${customer.email})`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

runSeed();
