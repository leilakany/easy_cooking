const mongoose = require('mongoose');

var SchemaTypes = mongoose.Schema.Types;
const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: false,
    },
    unit: {
        type: String,
        required: true,
    },
    api_id: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('Ingredient', ingredientSchema);
