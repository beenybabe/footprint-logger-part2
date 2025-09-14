const User = require("./User");
const Activity = require("./Activity");

// GET /activities/leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    // Aggregate total emissions per user
    const leaderboard = await Activity.aggregate([
      { $group: { _id: "$userId", totalEmissions: { $sum: "$co2" } } },
      { $sort: { totalEmissions: 1 } }, // sort ascending (lowest footprint first)
      { $limit: 10 }, // top 10 users
    ]);

    // Populate usernames
    const results = await Promise.all(
      leaderboard.map(async (entry) => {
        const user = await User.findById(entry._id);
        return {
          username: user ? user.username : "Anonymous",
          totalEmissions: entry.totalEmissions.toFixed(2),
        };
      })
    );

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});
