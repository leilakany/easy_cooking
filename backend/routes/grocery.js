const express = require('express');

const router = express.Router();
const GroceryList = require('../models/grocery_list');

router.post('/', async (req, res) => {
    const grocery_list = new GroceryList({
        name: req.body.name,
        is_complete: false,
        items: [],
    });

    // Add to mongo the entity previously created
    try {
        const newGroceryList = await grocery_list.save();
        res.status(200).json(newGroceryList);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all grocery list
router.get('/', async (req, res) => {
    try {
        const grocery_lists = await GroceryList.find(); // Return an array
        res.json(grocery_lists);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', getGrocery, (req, res) => {
    res.json(res.grocery_list);
});

router.delete('/:id', getGrocery, async (req, res) => {
    try {
        await res.grocery_list.remove();
        res.json({ message: 'Grocery list has been deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update list
router.patch('/:id', getGrocery, async (req, res) => {
    if (req.body.name != null) {
        res.grocery_list.name = req.body.name;
    }
    if (req.body.is_complete != null) {
        res.grocery_list.is_complete = req.body.is_complete;
    }
    if (req.body.items != null) {
        res.grocery_list.items = req.body.items;
    }
    try {
        const updatedGroceryList = await res.grocery_list.save();
        res.json(updatedGroceryList);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get grocery list async function
async function getGrocery(req, res, next) {
    try {
        grocery_list = await GroceryList.findById(req.params.id);
        if (grocery_list == null) {
            return res.status(404).json({ message: "Can't find this grocery list" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.grocery_list = grocery_list;
    next();
}

router.patch('/add_item/:id', async (req, res) => {
    if (!req.body) {
        return res.status(500).json({ message: 'Empty item' });
    }
    GroceryList.findByIdAndUpdate(
        req.params.id,
        {
            $push: {
                items: {
                    name: req.body.name,
                    quantity: req.body.quantity,
                    unit: req.body.unity,
                    checked: false,
                },
            },
        },
        { new: true, useFindAndModify: false, rawResult: true },
        (err, updated_list) => { res.send(updated_list); },
    );
});


module.exports = router;
