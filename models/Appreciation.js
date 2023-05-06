const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appreciationSchema = new Schema({
    rating: Number,
    review: String,
    date: Date,
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    restaurant: {type: Schema.Types.ObjectId, ref: 'Restaurant'}
});

appreciationSchema.index({user: 1, restaurant: 1, review: -1}, {unique: true})

const Appreciation = mongoose.model('Appreciation', appreciationSchema);
module.exports = Appreciation;