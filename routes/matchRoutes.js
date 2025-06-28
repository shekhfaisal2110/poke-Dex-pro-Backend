// const express = require("express");
// const fs = require("fs");
// const path = require("path");
// const router = express.Router();

// const filePath = path.join(__dirname, "../data/leaderboard.json");

// function readData() {
//   if (!fs.existsSync(filePath)) return [];
//   const data = fs.readFileSync(filePath);
//   return JSON.parse(data);
// }

// function writeData(data) {
//   fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
// }

// router.post("/match", (req, res) => {
//   const { username, result } = req.body;
//   let leaderboard = readData();

//   let user = leaderboard.find((u) => u.username === username);
//   if (!user) {
//     user = { username, wins: 0, losses: 0, draws: 0, games: 0 };
//     leaderboard.push(user);
//   }

//   if (result === "win") user.wins++;
//   else if (result === "lose") user.losses++;
//   else if (result === "draw") user.draws++;

//   user.games++;
//   writeData(leaderboard);
//   res.status(200).json({ message: "Match result saved!" });
// });

// router.get("/leaderboard", (req, res) => {
//   let leaderboard = readData();
//   leaderboard.sort((a, b) => b.wins - a.wins || a.games - b.games);
//   res.json(leaderboard.slice(0, 100));
// });

// module.exports = router;






const express = require("express");
const multer = require("multer");
const path = require("path");
const Leaderboard = require("../models/Leaderboard");
const MatchHistory = require("../models/MatchHistory");


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

// GET /api/leaderboard - Return top 100 with images
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
