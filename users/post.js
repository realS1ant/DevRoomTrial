const express = require('express');
const Comment = require('../schemas/Comment');
const User = require('../schemas/User');
const router = express.Router();

router.get('/', (req, res) => {
    let post = JSON.parse(JSON.stringify(req.post)); //copy
    const now = new Date();
    const created = new Date(post['created_at']);
    delete post['created_at'];
    post.time = (now - created) / 1000;
    post.time = `${Math.floor(post.time / 60 / 60 / 24)}d/${Math.floor(post.time / 60 / 60) % 24}h/${Math.floor(post.time / 60) % 60}m`;

    res.status(200).send({ post });
});

router.get('/comments', async (req, res) => {
    res.status(200).send({ comments: (await Comment.find({ post_id: req.post.id }, '_id')).map(x => x['_id']) });
});

router.get('/poster', async (req, res) => {
    let user = JSON.parse(JSON.stringify(await User.findById(req.post['user_id']))); //copy
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

module.exports = router;