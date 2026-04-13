const db = require("../db");

const bookEvent = async (req, res) => {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await db.query(
        "SELECT * FROM event_app.events WHERE id = $1",
        [eventId]
    );

    if (event.rows.length === 0) {
        return res.status(404).json({
        message: "Event not found"
        });
    }

    const existingBooking = await db.query(
        "SELECT * FROM event_app.bookings WHERE user_id = $1 AND event_id = $2",
        [userId, eventId]
    );

    if (existingBooking.rows.length > 0) {
        return res.status(400).json({
        message: "You have already booked this event"
        });
    }

    const bookingCount = await db.query(
        "SELECT COUNT(*) FROM event_app.bookings WHERE event_id = $1",
        [eventId]
    );
    
    const currentBookings = parseInt(bookingCount.rows[0].count);
    const maxCapacity = event.rows[0].max_capacity;

    if (currentBookings >= maxCapacity) {
        return res.status(400).json({
        message: "Event is full"
        });
    }

    const newBooking = await db.query(
        "INSERT INTO event_app.bookings (user_id, event_id) VALUES ($1, $2) RETURNING *",
        [userId, eventId]
    );

    return res.status(201).json({
        message: "Booking successful",
        booking: newBooking.rows[0]
    });
};

const getMyBookings = async (req, res) => {
    const userId = req.user.id;

    const result = await db.query(
        `SELECT bookings.id, events.title, events.event_date, events.location, events.description
        FROM event_app.bookings
        JOIN event_app.events ON bookings.event_id = events.id
        WHERE bookings.user_id = $1`,
        [userId]
    );

    return res.status(200).json({
        bookings: result.rows
    });
};

const cancelBooking = async (req, res) => {
    const bookingId = req.params.id;
    const userId = req.user.id;

    // 1. check booking exists and belongs to user
    const booking = await db.query(
        "SELECT * FROM event_app.bookings WHERE id = $1 AND user_id = $2",
        [bookingId, userId]
    );

    if (booking.rows.length === 0) {
        return res.status(404).json({
        message: "Booking not found"
        });
    }

    await db.query(
        "DELETE FROM event_app.bookings WHERE id = $1",
        [bookingId]
    );

    return res.status(200).json({
        message: "Booking cancelled"
    });
};

module.exports = {
    bookEvent,
    getMyBookings,
    cancelBooking
};