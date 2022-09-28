const express = require('express');
const router = express.Router();


router.get('/worker', (req, res) => {
    res.send("retailer Worker");
});

router.get('/seller', (req, res) => {
    res.send("retailer Seller");
});

module.exports = router;