const mongoose = require('mongoose');
const {DATABASE_URL} = process.env;

exports.connect = () => {
    mongoose.connect(DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log(`Connected to MongoDB`);
    })
    .catch(err => {
        console.log(`ERROR: ${err.message}`);
        process.exit(1);
    });
}