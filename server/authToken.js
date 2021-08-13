const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_KEY } = process.env;

const authToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        jwt.verify(token, JWT_KEY, (err, user) => {
            req.user = user;
            next();
        });
    } catch (err) {
        return res.status(401).json({
            message: "Auth Failed",
        });
    }
};

module.exports = { authToken };
