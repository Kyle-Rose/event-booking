const db = require('../db');
const bcrypt = require('bcrypt');

app.use(express.json());

const register = (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
};

const existingUser = await db.query('SELECT * FROM users WHERE username = $1', [email]
);
if (existingUser.rows.length > 0) {
    return res.status(400).json({ message: 'User already exists' });
}

const hashedPassword = await bcrypt.hash(password, 10);

const newUser = await db.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
    [username, email, hashedPassword]
);

return res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });