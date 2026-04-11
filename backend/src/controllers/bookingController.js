const db = require("../db");

const bookEvent = async (req, res) => {
    const eventId = req.params.id;
    const userId = req.user.id;

    const event = await db.query(
        "SELECT * FROM events WHERE id = $1",
        [eventId]
    );

    if (event.rows.length === 0) {
        return res.status(404).json({
        message: "Event not found"
        });
    }

    const existingBooking = await db.query(
        "SELECT * FROM bookings WHERE user_id = $1 AND event_id = $2",
        [userId, eventId]
    );

    if (existingBooking.rows.length > 0) {
        return res.status(400).json({
        message: "You have already booked this event"
        });
    }

    const currentBookings = parseInt(bookingCount.rows[0].count);
    const maxCapacity = event.rows[0].max_capacity;

    if (currentBookings >= maxCapacity) {
        return res.status(400).json({
        message: "Event is full"
        });
    }

    return res.status(201).json({
        message: "Booking successful",
        booking: newBooking.rows[0]
    });
};