const express = require('express');

const router = express.Router();
const Ingredient = require('../models/ingredient');

// Get all ingredients
router.get('/', async (req, res) => {
    try {
        const ingredients = await Ingredient.find(); // Return an array
        res.json(ingredients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get ingredient by id
router.get('/:id', getIngredient, (req, res) => {
    res.json(res.ingredient);
});

// Create ingredient
router.post('/', async (req, res) => {
    // Define a json object holding values
    const ingredient = new Ingredient({
        name: req.body.name,
        quantity: req.body.quantity,
        api_id: req.body.api_id,
        unit: req.body.unit,
    });

    // Add to mongo the entity previously created
    try {
        const newIngredient = await ingredient.save();
        res.status(200).json(newIngredient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update one ingredient
router.patch('/:id', getIngredient, async (req, res) => {
    if (req.body.name != null) {
        res.ingredient.name = req.body.name;
    }
    if (req.body.quantity != null) {
        res.ingredient.quantity = req.body.quantity;
    }
    if (req.body.api_id != null) {
        res.ingredient.api_id = req.body.api_id;
    }
    if (req.body.unit != null) {
        res.ingredient.unit = req.body.unit;
    }
    try {
        const updateIngredient = await res.ingredient.save();
        res.json(updateIngredient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete one ingredient
router.delete('/:id', getIngredient, async (req, res) => {
    try {
        await res.ingredient.remove();
        res.json({ message: 'Ingredient has been deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get ingredient async function
async function getIngredient(req, res, next) {
    try {
        ingredient = await Ingredient.findById(req.params.id);
        if (ingredient == null) {
            return res.status(404).json({ message: "Can't find ingredient" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.ingredient = ingredient;
    next();
}

// export is mandatory to return to app.js a proper router
module.exports = router;
