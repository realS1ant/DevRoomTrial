const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URL}/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, error => {
    if (error) console.error(error);
    else console.log('Mongoose connected successfully.')
});

app.get('/', (req, res) => {
    res.status(400).send({
        message: 'Hello World!'
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Express API listening on PORT: ${port}`);
});