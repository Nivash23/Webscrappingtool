const mongoose = require('mongoose');
const { MONGODB_URI, PORT } = require('./utils/config');


mongoose.connect(MONGODB_URI)
    .then(() => {
    console.log('mongodb connected..')
    })
    .catch((e) => {
    console.log(e)
})
