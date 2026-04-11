const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createEvent,
  getEvents,
  getEventById,
  deleteEvent
} = require("../controllers/eventController");

router.get("/", getEvents);
router.get("/:id", getEventById);

router.post("/", authMiddleware, createEvent);
router.delete("/:id", authMiddleware, deleteEvent);

module.exports = router;