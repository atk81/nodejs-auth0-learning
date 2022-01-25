require('dotenv').config(); // Load .env file
require('./config/database').connect(); // Load database configuration
const express = require('express');
const User = require('./models/User');

const app = express();
// Add a middleware to accept json data
app.use(express.json());

app.get("/api/v1/register", async (req, res) => {
    let {firstname, lastname, email, password} = req.body;
    // Validate the data
    if (!firstname || !lastname || !email || !password) {
        res.status(400).json({
            message: "Please enter all fields"
        });
        return ;
    }
    // Check if email already exists
    // remove all the white spaces from the email
    email = email.trim();
    const userExits = await User.findOne({email: email});
    if (userExits) {
        res.status(400).json({
            message: "Email already exists"
        });
        return ;
    }

    // Valiate password
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(password)){
        res.status(400).json({
            message:`Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character`
        });
        return ;
    };

    // Create a new user
    const user = new User({
        firstname,
        lastname,
        email,
        password
    });
    // TODO: Generate a token

    // Save the user
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
        return ;
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        });
        return ;
    }
})

app.get("/", (req, res) => {
    res.send("<h1> Hello from Auth0! </h1>");
});

module.exports = app;