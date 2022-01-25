const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const userAuthSchema = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: {
            validator: function(v) {
                // Validate email format using regex
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    token: {
        type: String,
        default: ''
    },
});

// Before saving the user, hash the password
userAuthSchema.pre('save', function(next) {
    const user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

module.exports = mongoose.model('User', userAuthSchema);