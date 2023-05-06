const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    isActive: {type: Boolean, default: true}
});

module.exports = imageSchema;