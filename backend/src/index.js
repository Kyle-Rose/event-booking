const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;
const cors = require("cors");

app.use(cors({
  origin: "*"
}));

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/", bookingRoutes);

const path = require("path");

// serve entire frontend folder
app.use(express.static(path.join(__dirname, "../../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/login/index.html"));
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});