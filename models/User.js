const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const localisationSchema = require('./Localisation');

const userSchema = new Schema({
    orders: [{type: Schema.Types.ObjectId, ref: 'Order'}],
    restaurants: [{type: Schema.Types.ObjectId, ref: 'Restaurant'}],
    appreciations: [{type: Schema.Types.ObjectId, ref: 'Appreciation'}],
    name: {type: String, required: true},
    surname: String,
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: Number,
    imageUrl: String,
    localisation: {type: localisationSchema},
});

const User = mongoose.model('User', userSchema);
module.exports = User;