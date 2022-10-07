const express = require('express');
const router = express.Router();
const countTime = require('../helper')

const {Data, Block} = require('../blockchain')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

let {productStorage} = require('./supplier');

const retailerWorkerKey = ec.keyFromPrivate(process.env.RETAILER_WORKER_KEY);
const retailerSellerKey = ec.keyFromPrivate(process.env.RETAILER_SELLER_KEY);

const retailerWorkerAddress = retailerWorkerKey.getPublic('hex');
const retailerSellerAddress = retailerSellerKey.getPublic('hex');

router.get('/worker', (req, res) => {
    console.log(productStorage)
    res.render("retailer_worker", {productStorage, countTime});

});

router.get('/receive', (req, res) => {
    if (req.query.serialNumber) {
        //create inspected data for new Block
        const data = new Data(retailerWorkerAddress, retailerWorkerAddress, "Stocked")
        data.signData(retailerWorkerKey)

        //add new Block into chain
        productStorage.map(product =>
            product.serialNumber === req.query.serialNumber ? product.addBlock(new Block(Date.now(), data, '')) : product
        );
        res.redirect("worker");
    } else {
        res.send("No query number provided")
    }
});

router.get('/label', (req, res) => {
    if (req.query.serialNumber) {
        //create inspected data for new Block
        const data = new Data(retailerWorkerAddress, retailerSellerAddress, "Labeled")
        data.signData(retailerWorkerKey)

        //add new Block into chain
        productStorage.map(product =>
            product.serialNumber === req.query.serialNumber ? product.addBlock(new Block(Date.now(), data, '')) : product
        );
        res.redirect("worker");
    } else {
        res.send("No query number provided")
    }
});

router.get('/seller', (req, res) => {
    res.render("retailer_seller", {productStorage, countTime});
});

router.get('/sell', (req, res) => {
    if (req.query.serialNumber) {
        //create inspected data for new Block
        const data = new Data(retailerSellerAddress, "Customer's address", "Sold")
        data.signData(retailerSellerKey)

        //add new Block into chain
        productStorage.map(product =>
            product.serialNumber === req.query.serialNumber ? product.addBlock(new Block(Date.now(), data, '')) : product
        );
        res.redirect("seller");
    } else {
        res.send("No query number provided")
    }
});

module.exports = router;