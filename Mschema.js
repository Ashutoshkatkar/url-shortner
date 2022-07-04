const mongoose = require('mongoose');

const udata = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    longurl: {
        type: String,
    },
    code: {
        type: String,
    },
    shorturl: {
        type: String,
    }
})

const user = mongoose.model("userdata", udata)

module.exports = user