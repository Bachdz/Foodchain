const express = require('express');
const router = express.Router();


router.get('/worker', (req, res) => {
    res.send("supplier Worker");
});

router.get('/inspector', (req, res) => {
    res.send("supplier Inspector");
});

module.exports = router;