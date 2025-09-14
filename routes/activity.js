// routes/activity.js
const express = require("express");
const Activity = require("../models/Activity");
const auth = require("../middleware/auth");

const router = express.Router();

// Add new activity
router.post("/", auth, async (req, res) => {
  try {
    const { category, description, co2 } = req.body;

    const activity = new Activity({
      user: req.user,
      category,
      description,
      co2,
    });

    await activity.save();
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all activities for logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user }).sort({
      date: -1,
    });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get total emissions for logged-in user
router.get("/summary", auth, async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user });
    const total = activities.reduce((sum, a) => sum + a.co2, 0);

    res.json({ total, count: activities.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// routes/activity.js (add after existing routes)

// Get community average emissions
router.get("/community/average", auth, async (req, res) => {
  try {
    const result = await Activity.aggregate([
      { $group: { _id: null, avgEmissions: { $avg: "$co2" } } },
    ]);

    const avg = result.length > 0 ? result[0].avgEmissions : 0;
    res.json({ average: avg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get leaderboard (top emitters vs. lowest emitters)
router.get("/community/leaderboard", auth, async (req, res) => {
  try {
    const result = await Activity.aggregate([
      { $group: { _id: "$user", totalEmissions: { $sum: "$co2" } } },
      { $sort: { totalEmissions: 1 } }, // lowest first (eco-friendly ranking)
      { $limit: 10 },
    ]);

    // Populate usernames
    const populated = await Promise.all(
      result.map(async (r) => {
        const user = await require("../../models/User")
          .findById(r._id)
          .select("username");
        return {
          username: user?.username || "Unknown",
          totalEmissions: r.totalEmissions,
        };
      })
    );

    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
