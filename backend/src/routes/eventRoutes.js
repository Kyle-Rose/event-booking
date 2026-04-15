const express = require("express");
const router = express.Router();
console.log("EVENT ROUTES LOADED");

const authMiddleware = require("../middleware/authMiddleware");

const {
  createEvent,
  getEvents,
  getEventById,
  deleteEvent,
  editEvent
} = require("../controllers/eventController");

router.get("/", getEvents);
router.get("/:id", getEventById);

router.put("/:id", authMiddleware, editEvent);

router.post("/", authMiddleware, createEvent);
router.delete("/:id", authMiddleware, deleteEvent);

module.exports = router;