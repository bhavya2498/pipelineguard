const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // plain for prototype only — hash in production
    role: {
      type: String,
      enum: ["Operator", "Administrator"],
      default: "Operator",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
