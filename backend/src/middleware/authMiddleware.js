const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    console.log("AUTH MIDDLEWARE HIT");

    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("DECODED TOKEN:", decoded);

        req.user = decoded;

        console.log("REQ USER SET:", req.user);

        next();
    } catch (err) {
        console.log("JWT ERROR:", err.message);
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;