const mongoose = require('mongoose');

const foodSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true},
    type: {type: String, require: true},
    ingredients: {type: Array, required: true},
    qty: {type: Array, required: true},
    foodImage: {type: String, required: true} 
});

module.exports = mongoose.model('Food',foodSchema);