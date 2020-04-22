const mongoose = require('mongoose');

const GroceryList = mongoose.model(
    'GroceryList',
    new mongoose.Schema({
        name: String,
        is_complete: Boolean,
        items: [],
    }),
);

module.exports = GroceryList;
