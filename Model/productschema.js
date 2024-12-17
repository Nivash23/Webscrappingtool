const mongoose = require('mongoose');

const productschema = new mongoose.Schema({
    productname: String,
    price: String,
    url: String,
    lastcheck: Date
})

const Product = mongoose.model('ScrappingProduct', productschema, 'ScrappingProducts');


module.exports = Product;