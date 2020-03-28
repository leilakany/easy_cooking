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
// export is mandatory to return to app.js a proper router
module.exports = router;
