// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const matchRoutes = require("./routes/matchRoutes");

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use("/api", matchRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const matchRoutes = require("./routes/matchRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve image files
app.use("/api", matchRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
