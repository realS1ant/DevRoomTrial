const express = require('express');
const mongoose = require('mongoose');
const Post = require('../schemas/Post');
const Comment = require('../schemas/Comment');
const router = express.Router();

// localhost:5000/users/<user>/...

router.get('/', (req, res) => {
    let user = JSON.parse(JSON.stringify(req.user)); //copy
    let dob = new Date();
    let now = new Date();
    dob.setFullYear(user['date_of_birth'].year);
    dob.setMonth(user['date_of_birth'].month - 1);
    dob.setDate(user['date_of_birth'].day);
    delete user.date_of_birth;
    user['age'] = now.getFullYear() - dob.getFullYear();
    if ((now.getMonth() - dob.getMonth()) < 0 || (((now.getMonth() - dob.getMonth()) == 0) && (now.getDate() < dob.getDate()))) user.age--;
    res.status(200).send({ user });
});

router.get('/posts', async (req, res) => {
    res.status(200).send({ posts: (await Post.find({ user_id: req.user.id }, '_id')).map(x => x['_id']) });
});

router.post('/posts', async (req, res) => {
    const { title, body } = req.body;
    if (!title || !body) {
        res.status(400).send({
            message: 'Invalid post title or body!'
        });
        return;
    }

    res.status(200).send(await new Post({
        user_id: req.user.id,
        title,
        body
    }).save());
});

router.use('/posts/:postId', async (req, res, next) => {
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId)) {
        res.status(400).send({
            message: 'That is not a valid post id.'
        });
        return;
    }

    let post = await Post.findById(postId);

    if (post) {
        req.post = post;
        next();
    }
    else res.status(204).send({ message: 'No post available with that ID.' });
}, require('./post'));


router.get('/comments', async (req, res) => {
    res.status(200).send({ comments: (await Comment.find({ user_id: req.user.id }, '_id')).map(x => x['_id']) });
});

router.post('/comments', async (req, res) => {
    const { post_id, body } = req.body;
    if (!post_id || !mongoose.isValidObjectId(post_id) || !body) {
        res.status(400).send({
            message: 'Invalid postID or body!'
        });
        return;
    }

    if (!(await Post.findById(post_id))) {
        res.status(400).send({
            message: 'That post could not be found.'
        });
        return;
    }

    res.status(200).send(await new Comment({
        user_id: req.user.id,
        post_id,
        body
    }).save());
});

router.use('/comments/:commentId', async (req, res, next) => {
    const { commentId } = req.params;
    if (!mongoose.isValidObjectId(commentId)) {
        res.status(400).send({
            message: 'That is not a valid comment id.'
        });
        return;
    }

    let comment = await Comment.findById(commentId);

    if (comment) {
        req.comment = comment;
        next();
    }
    else res.status(204).send({ message: 'No comment available with that ID.' });
}, require('./comment'));

module.exports = router;