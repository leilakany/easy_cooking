var express = require("express");
var router = express.Router();
const Ingredient = require('../models/ingredient')

// Get all ingredients
router.get('/', async (req, res) => {
    try{
        const ingredients = await Ingredient.find() // Return an array
        res.json(ingredients)
    }catch(err){
        res.status(500).json({message : err.message})
    }
})

// Get ingredient by id
router.get('/:id', getIngredient, (req,res) => {
    res.json(res.ingredient)
})

// Create ingredient
router.post('/', async(req, res) => {
    // Define a json object holding values
    const ingredient = new Ingredient({
        name: req.body.name,
        quantity: req.body.quantity
    })

    // Add to mongo the entity previously created
    try {
        const newIngredient = await ingredient.save()
        res.status(200).json(newIngredient)
    } catch(err) {
        res.status(400).json({message: err.message})
    }
})

// Update one ingredeint
router.patch('/:id', getIngredient, async(req, res) => {
    if(req.body.name != null){
        res.ingredeint.name = req.body.name
    }
    if (req.body.quantity != null) {
        res.ingredeint.quantity = req.body.quantity
    }
    try {
        const updateIngredient = await res.ingredeint.save()
        res.json(updateIngredient)
    } catch(err) {
        res.status(400).json({message: err.message})
    }
})

// Delete one ingredient
router.delete('/:id', getIngredient, async (req,res) => {
    try {
        await res.ingredient.remove()
        res.json({message: "Ingredient has been deleted"})
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

// Get ingredient async function
async function getIngredient(req, res, next) {
    try {
        ingredient = await Ingredient.findById(req.params.id)
        if(ingredient == null) {
            return res.status(404).json({message: "Can't find ingredient"})
        }
    } catch(err) {
        return res.status(500).json({message: err.message})
    }
    res.ingredient = ingredient
    next()
}

// export is mandatory to return to app.js a proper router
module.exports = router;
