const mongoose = require("mongoose");

const SchemaAds = new mongoose.Schema({
    img: {
        type: String,
        maxlength: 100,
        required: true
    },
    title: {
        type: String,
        default: '',
        maxlength: 100,
    },
    url: {
        type: String,
        required: true,
        maxlength: 255,
    },
    num_visit: {
        type: Number,
        default: 0,
    }
})

const ADS = mongoose.model('ad', SchemaAds);

module.exports = ADS;