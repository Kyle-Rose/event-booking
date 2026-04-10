const db = require('../db');

const createEvent = async (req, res) => {
    const { title, event_date, location, max_capacity, description} = req.body;

    if (!title || !event_date || !location || !max_capacity) {
        return res.status(400).json({ message: 'Title, event date, location, and max capacity are required.' });
    }

    const userId = req.user.id;

    const newEvent = await db.query(
        'INSERT INTO event_app.events (title, event_date, location, max_capacity, description, creator_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, event_date, location, max_capacity, description, userId]
    );

    return res.status(201).json({ message: 'Event created successfully', event: newEvent.rows[0] });
}

const getEvents = async (req, res) => {
    const result = await db.query('SELECT * FROM event_app.events');
    
    return res.status(200).json({ events: result.rows });

};

module.exports = { createEvent, getEvents };