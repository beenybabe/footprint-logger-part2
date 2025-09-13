// models/Activity.js
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: {
    type: String,
    enum: ["transport", "food", "energy"],
    required: true,
  },
  description: { type: String, required: true },
  co2: { type: Number, required: true }, // grams or kg of CO₂
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Activity", activitySchema);
