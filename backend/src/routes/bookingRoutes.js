const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  bookEvent,
  getMyBookings,
  cancelBooking,
  getEventBookings

} = require("../controllers/bookingController");

router.post("/events/:id/book", authMiddleware, bookEvent);

router.get("/me/bookings", authMiddleware, getMyBookings);

router.delete("/bookings/:id", authMiddleware, cancelBooking);

router.get("/bookings", authMiddleware, getEventBookings);

module.exports = router;