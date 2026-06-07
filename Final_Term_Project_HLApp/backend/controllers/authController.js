const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || "1d",
  });
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!["admin", "doctor", "patient"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    passwordHash,
    role,
  });

  await user.save();

  const token = generateToken(user._id, user.role);
  res.status(201).json({
    message: "User registered successfully",
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateToken(user._id, user.role);
  res.json({
    message: "Login successful",
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

exports.logout = (req, res) => {
  res.json({ message: "Logout successful. Clear token on client." });
};
