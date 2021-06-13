const express = require('express');
const mongoose = require('mongoose');
const Post = require('../schemas/Post');
const Comment = require('../schemas/Comment');
const router = express.Router();

// localhost:5000/users/<user>/comments/<comment>/...

router.get('/', (req, res) => {
    res.status(200).send({ comment: req.comment });
});

module.exports = router;