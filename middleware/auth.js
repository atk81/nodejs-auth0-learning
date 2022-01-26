const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // Get token from header, cookie or query string
    // Accept header: "Authorization: Bearer <token>"
    // Cookie: "token=<token>"

    const token = req.header('Authorization')?.replace("Bearer ", "") ||
        req.cookies.token ||
        req.query.token;
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({
                message: "Not authorized to access this route"
            });
        }
        // Add user from payload
        req.user_id = payload.user_id;
        next();
    });
}

module.exports = auth;