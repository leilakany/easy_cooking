var express = require("express");
const Ingredient = require('../models/ingredient')
var router = express.Router();
const GroceryList = require('../models/grocery_list')

router.post('/', async (req, res) => {
    const grocery_list = new GroceryList({
        name: req.body.name,
        is_complete: false,
        items: []
    })

    // Add to mongo the entity previously created
    try {
        const newGroceryList = await grocery_list.save()
        res.status(200).json(newGroceryList)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Get all grocery list
router.get('/', async (req, res) => {
    try {
        const grocery_lists = await GroceryList.find() // Return an array
        res.json(grocery_lists)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getGrocery, (req, res) => {
    res.json(res.grocery_list)
})

router.delete('/:id', getGrocery, async (req, res) => {
    try {
        await res.grocery_list.remove()
        res.json({ message: "Grocery list has been deleted" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Update list
router.patch('/:id', getGrocery, async (req, res) => {
    if (req.body.name != null) {
        res.grocery_list.name = req.body.name
    }
    if (req.body.is_complete != null) {
        res.grocery_list.is_complete = req.body.is_complete
    }
    if (req.body.items != null) {
        res.grocery_list.items = req.body.items
    }
    try {
        const updatedGroceryList = await res.grocery_list.save()
        res.json(updatedGroceryList)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Get grocery list async function
async function getGrocery(req, res, next) {
    try {
        grocery_list = await GroceryList.findById(req.params.id)
        if (grocery_list == null) {
            return res.status(404).json({ message: "Can't find this grocery list" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.grocery_list = grocery_list
    next()
}

// ITEM ROUTES

// // Check all items in the list
async function checkall(groceryId){
    let ITEM_VALIDATED = true
    let GROCERY_LIST_VALIDATED = true
    GroceryList.findById(groceryId,
        function (err, groceryList) {
            if (err) return res.status(500).json({message: err.message})
            groceryList.items.forEach(function (item, index) {
                this[index].checked = ITEM_VALIDATED
            }, groceryList.items)

            groceryList.is_complete = GROCERY_LIST_VALIDATED

            groceryList.save((err, updatedGrocery) => {
                if (err) return err.message
            })
        })
}

// Add all checked items to fridge
router.patch('/:id/confirm', async (req, res) => {
    // A single response to send to user
    GroceryList.findById(req.params.id,
        function (err, groceryList) {
            if (err) return res.send(500).json({ message: err.message })
            groceryList.items.forEach(async function (item, index) {

                // Define a json object holding values
                const ingredient = new Ingredient({
                    name: item.name,
                    quantity: item.quantity,
                    // TODO : add api_id when adding from recipe or from new grocery list
                    api_id: 0,
                    unit: item.unit
                })

                // Add to mongo the entity previously created
                try {
                   const newIngredient = await ingredient.save()
                } catch (err) {
                    res.status(500).json({message : err.message})
                }
            })
            // If checkall is true, then we check all items in the grocery list
            if(req.body.checkall){
                checkall(req.params.id)
            }
            res.status(200).json({message: "all items saved"})
        })


})


// Change item 'check' state
router.patch('/:id/item/:itemId', async (req, res) => {

    // Get the item state and inverse it
    GroceryList.findOne({ 'items._id': req.params.itemId },
        function (err, grocery) {
            if (err) return res.status(500).json({ message: err.message })

            item = grocery.items.id(req.params.itemId)
            item.checked = !item.checked;

            grocery.save((err, updatedGrocery) => {
                if (err) return res.status(500).json({ message: err.message })
                return res.status(200).json(updatedGrocery)
            })
        }
    )
})

// Add item to grocery list
router.post('/:id/item', async (req, res) => {
    if (!req.body) {
        return res.status(500).json({ 'message': 'Empty item' })
    } else {
        GroceryList.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    items: {
                        name: req.body.name,
                        quantity: req.body.quantity,
                        unit: req.body.unit,
                        checked: false,
                    }
                }
            },
            { new: true, useFindAndModify: false, rawResult: true }
            , (err, updated_list) => {
                if (err) return res.status(500).json({ message: err.message })
                res.send(updated_list)
            })
    }
})


module.exports = router
