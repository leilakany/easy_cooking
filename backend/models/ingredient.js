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
    }
})

module.exports = mongoose.model('Ingredient', ingredientSchema);
