const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    meal: {type: Schema.Types.ObjectId, ref: 'Meal', required: true},
    date: Date,
    quantity: {type: Number, required: true, default: 1},
    hot: {type: Boolean, default: true},
    spiced: {type: Boolean, default: false},
    others: String
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;