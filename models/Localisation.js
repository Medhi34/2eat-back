const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const localisationSchema = new Schema({
    longitude: Number,
    latitude: Number,
    country: {type: String, default: "Cameroun"},
    city: {type: String, default: "Yaoundé"},
    area: String
});
localisationSchema.index({longitude: 1, latitude: -1}, {unique: true})

module.exports = localisationSchema;