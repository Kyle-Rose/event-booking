require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";


app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());


const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");


app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/bookings", bookingRoutes);

app.use(express.static(path.join(__dirname, "..", "frontend")));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "login", "index.html"));x
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});