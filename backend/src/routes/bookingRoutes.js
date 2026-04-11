const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  bookEvent,
  getMyBookings,
  cancelBooking
} = require("../controllers/bookingController");

router.post("/events/:id/book", authMiddleware, bookEvent);

router.get("/me/bookings", authMiddleware, getMyBookings);

router.delete("/bookings/:id", authMiddleware, cancelBooking);

module.exports = router;