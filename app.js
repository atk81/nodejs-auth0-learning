require('dotenv').config(); // Load .env file
require('./config/database').connect(); // Load database configuration
const express = require('express');

const app = express();
// Add a middleware to accept json data
app.use(express.json());

app.get("/register", (req, res) => {
    const {firstname, lastname, email, password} = req.body;
    // Validate the data
    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({
            message: "Please enter all fields"
        });
    }
    // Check if email already exists
    const userExits = User.findOne({email: email});
    if (userExits) {
        return res.status(400).json({
            message: "Email already exists"
        });
    }

    // Valiate password
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(password)){
        return res.send(400).json({
            message:`Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character`
        });
    };

    // Hash the password



})

app.get("/", (req, res) => {
    res.send("<h1> Hello from Auth0! </h1>");
});

module.exports = app;