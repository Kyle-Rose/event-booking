const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

app.use(express.json());
app.use("/", authRoutes);
app.use("/", eventRoutes);

app.get("/", (req, res) => {
  res.send("Event API");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});