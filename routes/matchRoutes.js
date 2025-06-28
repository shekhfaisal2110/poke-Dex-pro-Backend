const express = require("express");
const multer = require("multer");
const path = require("path");
const Leaderboard = require("../models/Leaderboard");



const router = express.Router();

// 🖼 Set up multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// POST /api/match - Submit match result (with optional image)
router.post("/match", upload.single("image"), async (req, res) => {
  try {
    const { username, result } = req.body;
    let imagePath = "";

    
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    let user = await Leaderboard.findOne({ username });

    if (!user) {
      user = new Leaderboard({ username });
    }

    if (imagePath) {
      user.image = imagePath; // update image only if new one is uploaded
    }

    

    if (result === "win") user.wins++;
    else if (result === "lose") user.losses++;
    else if (result === "draw") user.draws++;

    user.games++;

    await user.save();

    res.status(200).json({ message: "Match result saved!" });
  } catch (error) {
    console.error("Error saving match:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const topPlayers = await Leaderboard.find()
      .sort({ wins: -1, games: 1 }) // Highest wins first, lowest games as tie-breaker
      .limit(100); // only top 100

    res.json(topPlayers);
  } catch (error) {
    console.error("Error fetching leaderboard:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
