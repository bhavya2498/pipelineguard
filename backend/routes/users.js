const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /api/users (List users for admin governance)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/register
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/users/:id/role (Administrator only: change user role)
router.patch("/:id/role", async (req, res) => {
  try {
    const userRole = req.headers["x-user-role"];
    if (userRole === "Operator") {
      return res.status(403).json({
        error: "Access Denied: Only Administrators can promote or demote user roles.",
      });
    }

    const { role } = req.body;
    if (!["Operator", "Administrator"].includes(role)) {
      return res.status(400).json({ error: "Invalid role specified." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, select: "-password" }
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
