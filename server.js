const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/footprint";

app.use(express.static("public"));
app.use(express.json()); 

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/activities", require("./routes/activity"));

app.get("/", (req, res) => {
  res.send("🌍 Footprint Logger API running!");
});

// Connect DB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Mongo error:", err));
