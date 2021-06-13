const mongoose = require('mongoose');

const comment = new mongoose.Schema({
    post_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    user_id: {
        type: mongoose.Types.ObjectId,
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

module.exports = mongoose.model('Comment', comment);