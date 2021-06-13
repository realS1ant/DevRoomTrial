const express = require('express');
const mongoose = require('mongoose');
const User = require('../schemas/User');
const router = express.Router();

router.use('/:query', async (req, res, next) => {
    const { query } = req.params;
    if (!query) {
        res.status(204);
        return;
    }
    if (mongoose.isValidObjectId(query)) {
        req.user = await User.findById(query);
        next();
    } else {
        const user = await User.findOne({ username: query });
        if (user) {
            req.user = user;
            next();
        } else {
            res.status(204).send({
                message: 'No user found.'
            });
            return;
        }
    }
}, require('./user'));

router.post('/', async (req, res) => {
    const { username, display_name, date_of_birth, email } = req.body;

    if (!username || !email) {
        res.status(400).send({
            message: 'Username and Email are required, Date of Birth and Display Name is optional.'
        });
        return;
    }

    if (await User.findOne({ username })) {
        res.status(409).send({
            message: 'That username is already in use!'
        })
        return;
    }
    if (await User.findOne({ email })) {
        res.status(409).send({
            message: 'That email is already in use!'
        })
        return;
    }

    if (username.includes(' ') || username.length < 3 || username.length > 18) {
        res.status(400).send({
            message: 'Username must be 3-18 characters and not contain spaces.'
        });
        return;
    }

    if (display_name && 3 < display_name.length > 24) {
        res.status(400).send({
            message: 'Display name must be 3-24 characters.'
        });
        return;
    }

    //DOB validation needed here -- complicated topic.
    if (date_of_birth && !(date_of_birth.year && date_of_birth.month && date_of_birth.day && 1000 < date_of_birth['year'] && date_of_birth['year'] < 9999 && 1 <= date_of_birth['month'] && date_of_birth['month'] <= 12 && 1 <= date_of_birth['day'] && date_of_birth['day'] <= 31)) {
        res.status(400).send({
            message: 'Invalid Date of Birth.'
        });
        return;
    }

    const user = await new User({
        username: username.toLowerCase(),
        display_name: display_name || username[0].toUpperCase() + username.slice(1),
        email,
        date_of_birth: date_of_birth || null
    }).save();
    res.status(200).send({ user });
});

router.get('/:query/posts')

module.exports = router;