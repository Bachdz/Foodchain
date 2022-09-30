const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    // console.log(foodChain);

    // if(foodChain.isValid()) {
        res.render("home");
    // } else {
    //     res.send("couldn't initialize Foodchain!")
    // }
});


module.exports = router;

