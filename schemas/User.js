const mongoose = require('mongoose');

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    display_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date_of_birth: {
        day: {
            type: Number,
            required: false
        },
        month: {
            type: Number,
            required: false
        },
        year: {
            type: Number,
            required: false
        }
    },
    created_at: {
        type: Date,
        required: false,
        default: Date.now()
    }
});

module.exports = mongoose.model('User', user);