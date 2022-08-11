const router = require('express').Router();
const User = require('../models/User');
const verifyToken = require('./verifyToken');


router.get('/', verifyToken, (req, res) => {
    res.send(req.user);
    User.findOne({_id: req.user})
})




module.exports = router;