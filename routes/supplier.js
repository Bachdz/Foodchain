const express = require('express');
const router = express.Router();
const countTime = require('../helper')
const {Blockchain, Data, Block} = require('../blockchain')
const util = require('util')


const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const generator = require('generate-serial-number');

const supplierWorkerKey = ec.keyFromPrivate(process.env.SUPPLIER_WORKER_KEY);
const supplierInspectorKey = ec.keyFromPrivate(process.env.SUPPLIER_INSPECTOR_KEY);
const retailerWorkerKey = ec.keyFromPrivate(process.env.RETAILER_WORKER_KEY);

const supplierInspectorAddress = supplierInspectorKey.getPublic('hex');
const supplierWorkerAddress = supplierWorkerKey.getPublic('hex');
const retailerWorkerAddress = retailerWorkerKey.getPublic('hex');

let productStorage = []


function createNewProduct() {
    //initialize new product
    let newSerialNumber = generator.generate(7);
    let newProduct = new Blockchain(newSerialNumber);
    productStorage.push(newProduct)

    //create manufactured data for new Block
    const data = new Data(supplierWorkerAddress, supplierInspectorAddress, "Manufactured")
    data.signData(supplierWorkerKey)

    //add new Block into chain
    productStorage.map(product =>
        product.serialNumber === newSerialNumber ? product.addBlock(new Block(Date.now(), data, '')) : product
    );

}


router.get('/worker', (req, res) => {
    console.log(util.inspect(productStorage, false, null, true /* enable colors */))
    res.render("supp_worker", {productStorage, countTime});
});

router.get('/new_product', (req, res) => {
    createNewProduct();
    res.redirect("worker");
});

router.get('/ship', (req, res) => {
    if (req.query.serialNumber) {
        //create inspected data for new Block
        const data = new Data(supplierWorkerAddress, retailerWorkerAddress, "Shipped")
        data.signData(supplierWorkerKey)

        //add new Block into chain
        productStorage.map(product =>
            product.serialNumber === req.query.serialNumber ? product.addBlock(new Block(Date.now(), data, '')) : product
        );

        res.redirect("worker");
    } else {
        res.send("No query number provided")
    }
});

router.get('/inspector', (req, res) => {
    res.render("supp_inspector", {productStorage, countTime});
});

router.get('/inspect', (req, res) => {
    if (req.query.serialNumber) {
        //create inspected data for new Block
        const data = new Data(supplierInspectorAddress, supplierWorkerAddress, "Inspected")
        data.signData(supplierInspectorKey)

        //add new Block into chain
        productStorage.map(product =>
            product.serialNumber === req.query.serialNumber ? product.addBlock(new Block(Date.now(), data, '')) : product
        );

        console.log(util.inspect(productStorage, false, null, true /* enable colors */))
        res.redirect("inspector");
    } else {
        res.send("No query number provided")
    }
});

module.exports = router;
module.exports.productStorage = productStorage;