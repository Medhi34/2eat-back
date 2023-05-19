const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Image = require('./Image');

const mealSchema = new Schema({
    name: {type: String, unique: true},
    images: {type: Map, of: Image},
    accompagnements: [String],
    price: {type: Number, required: true},
    restaurant: {type: Schema.Types.ObjectId, ref: 'Restaurant'}
});

const Meal = mongoose.model('Meal', mealSchema);
module.exports = Meal;