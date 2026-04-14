require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/", bookingRoutes);

const frontendPath = path.join(__dirname, "..", "..", "frontend");

app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.redirect("/login/index.html");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});