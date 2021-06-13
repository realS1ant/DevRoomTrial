const mongoose = require('mongoose');

const post = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: false,
        default: Date.now()
    }
});

module.exports = mongoose.model('Post', post);