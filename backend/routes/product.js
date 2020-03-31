var express = require("express");
var router = express.Router();
const Product = require('../models/product')

// Get all products
router.get('/', async (req, res) => {
    try{
        const products = await Product.find() // Return an array
        res.json(products)
    }catch(err){
        res.status(500).json({message : err.message})
    }
})

// Get product by id
router.get('/:id', getProduct, (req,res) => {
    res.json(res.product)
})

// Create product
router.post('/', async(req, res) => {
    // Define a json object holding values
    const product = new Product({
        name: req.body.name,
        quantity: req.body.quantity
    })

    // Add to mongo the entity previously created
    try {
        const newProduct = await product.save()
        res.status(200).json(newProduct)
    } catch(err) {
        res.status(400).json({message: err.message})
    }
})

// Update one product
router.patch('/:id', getProduct, async(req, res) => {
    if(req.body.name != null){
        res.product.name = req.body.name
    }
    if (req.body.quantity != null) {
        res.product.quantity = req.body.quantity
    }
    try {
        const updatedProduct = await res.product.save()
        res.json(updatedProduct)
    } catch(err) {
        res.status(400).json({message: err.message})
    }
})

// Delete one product
router.delete('/:id', getProduct, async (req,res) => {
    try {
        await res.product.remove()
        res.json({message: "Product has been deleted"})
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

// Get product async function
async function getProduct(req, res, next) {
    try {
        product = await Product.findById(req.params.id)
        if(product == null) {
            return res.status(404).json({message: "Can't find product"})
        }
    } catch(err) {
        return res.status(500).json({message: err.message})
    }
    res.product = product
    next()
}

// export is mandatory to return to app.js a proper router
module.exports = router;
