const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const localisationSchema = require('./Localisation');
const Image = require('./Image');

const restaurantSchema = new Schema({
    name: {type: String, unique: true},
    phone: Number,
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    date_save: {type: Date},
    localisation: {type: localisationSchema},
    categories: {type: [String], enum: ['Street-food', 'Fast-food', 'Caféteria', 'Café-Resto', 'Restaurant Classique', 'Cuisine Traditionnelle']},
    nbVotes: {type: Number, default:1},
    images: {type: Map, of: Image},
    meals: [{type: Schema.Types.ObjectId, ref: 'Meal'}],
    appreciations: [{type: Schema.Types.ObjectId, ref: 'Appreciation'}]
});

restaurantSchema.plugin(uniqueValidator);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;