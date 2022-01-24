import mongoose from 'mongoose';
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
            message: props => `{props.value} is not a valid email address!`
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

module.exports = mongoose.model('User', userAuthSchema);