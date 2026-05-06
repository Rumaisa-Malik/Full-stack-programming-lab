const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String
});

// Product Model
const Product = mongoose.model("Product", productSchema);

// Home Route
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Add Product API
app.get("/add-product", async (req, res) => {

  const product = new Product({
    name: "Laptop",
    price: 120000,
    category: "Electronics"
  });

  await product.save();

  res.send("Product Added");
});

// Get Products API
app.get("/products", async (req, res) => {

  const products = await Product.find();

  res.json(products);
});

// Server Start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});