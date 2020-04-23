const mongoose = require('mongoose');

const GroceryList = mongoose.model(
    'GroceryList',
    new mongoose.Schema({
        name: String,
        is_complete: Boolean,
        items: [{
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
            checked: {
                type: Boolean,
                required: false,
            }
        }]
    })
)

module.exports = GroceryList;
