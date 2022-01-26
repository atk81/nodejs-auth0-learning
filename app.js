require('dotenv').config(); // Load .env file
require('./config/database').connect(); // Load database configuration
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');

const User = require('./models/User');

const app = express();
// Add a middleware to accept json data
app.use(express.json());
// Add a middleware to accept cookies
app.use(cookieParser());

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

    try {
        // Create a new user
        const user = await User.create({
            firstname,
            lastname,
            email,
            password
        });
        const token = jwt.sign({
            user_id: user._id,
        },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        user.token = token;
        user.password = undefined // Remove password from response

        res.status(201).json(user);
        return;
    } catch (error) {
        console.log(error);
        res.send(500).json({
            message: "Something went wrong"
        });
    }
});

app.get("/api/v1/login", async (req, res) => {
    let { email, password } = req.body;
    // Validate the data
    if (!email || !password) {
        res.status(400).json({
            message: "Please enter all fields"
        });
        return;
    }
    // Check if email exists
    // remove all the white spaces from the email
    email = email.trim();
    const userExits = await User.findOne({ email: email });
    if (!userExits) {
        res.status(400).json({
            message: "Email is not registered"
        });
        return;
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, userExits.password);
    if (!isPasswordCorrect) {
        res.status(400).json({
            message: "Password is incorrect"
        });
        return;
    }

    try {
        // Create a jwt token
        const token = jwt.sign({
            user_id: userExits._id,
        },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        userExits.token = token;
        userExits.password = undefined // Remove password from response
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
        res.status(200).json(userExits);
        return;
    } catch (error) {
        console.log(error);
        res.send(500).json({
            message: "Something went wrong"
        });
    }
});

app.get("/api/v1/dashboard", auth, async(req,res)=>{
    try {
        const user = await User.findOne({ _id: req.user_id });
        // console.log(user);
        // console.log(req.user_id);
        user.password = undefined;
        res.status(200).json({
            message: "Welcome to dashboard, you are logged in",
            user,
        });
    } catch (error) {
        console.log(error);
        res.send(500).json({
            message: "Something went wrong"
        });
    }
});

app.get("/", (req, res) => {
    res.send("<h1> Hello from Auth0! </h1>");
});

module.exports = app;