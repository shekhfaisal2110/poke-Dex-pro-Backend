const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  games: { type: Number, default: 0 },
  image: { type: String, default: "" } // optional image URL or path
});

module.exports = mongoose.model("Leaderboard", LeaderboardSchema);
