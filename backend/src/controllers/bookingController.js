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
        `SELECT 
  bookings.id AS booking_id,
  events.id AS event_id,
  events.title,
  events.event_date,
  events.location,
  events.description
FROM event_app.bookings
JOIN event_app.events
ON bookings.event_id = events.id
WHERE bookings.user_id = $1;`,
        [userId]
    );

    return res.status(200).json({
        bookings: result.rows
    });
};

const cancelBooking = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const bookingId = req.params.id;

        // 1. Get booking WITHOUT filtering user first
        const booking = await db.query(
            "SELECT * FROM event_app.bookings WHERE id = $1",
            [bookingId]
        );

        if (booking.rows.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const foundBooking = booking.rows[0];

        // 2. Permission check
        const isOwner = foundBooking.user_id === req.user.id;
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Forbidden" });
        }

        // 3. Delete booking
        await db.query(
            "DELETE FROM event_app.bookings WHERE id = $1",
            [bookingId]
        );

        return res.status(200).json({ message: "Booking cancelled" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const getEventBookings = async (req, res) => { 
    const bookings = await db.query(`
SELECT 
  b.id AS booking_id,
  b.user_id,
  b.event_id,
  u.name AS user_name,
  e.title AS event_name
FROM event_app.bookings b
JOIN event_app.users u ON b.user_id = u.id
JOIN event_app.events e ON b.event_id = e.id;
`
    );

    return res.status(200).json({
        bookings: bookings.rows
    });
};


module.exports = {
    bookEvent,
    getMyBookings,
    cancelBooking,
    getEventBookings
};