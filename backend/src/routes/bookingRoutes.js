const express = require("express");
const router = express.Router();

console.log("BOOKING ROUTES LOADED");

const authMiddleware = require("../middleware/authMiddleware");

const {
  bookEvent,
  getMyBookings,
  cancelBooking,
  getEventBookings
} = require("../controllers/bookingController");

// Book event (protected)
router.post("/events/:id/book", authMiddleware, bookEvent);

// Get my bookings (protected)
router.get("/me/bookings", authMiddleware, getMyBookings);

// ❌ FIXED: now protected properly
router.delete(
  "/bookings/:id",
  authMiddleware,
  (req, res, next) => {
    console.log("DELETE BOOKING HIT:", req.params.id);
    next();
  },
  cancelBooking
);

// Admin / all bookings (protected)
router.get("/bookings", authMiddleware, getEventBookings);

module.exports = router;