const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents
} = require("../controllers/eventController");

const authMiddleware = require("./middleware/authMiddleware");


router.post("/events", authMiddleware, createEvent);

router.get("/events", getEvents);


module.exports = router;