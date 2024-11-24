
const express = require('express');
const router = express.Router();
const { getAddressBalance } = require('../controllers/balanceController.js');


//const requireAuth = require('../middleware/requireAuth');

//router.use(requireAuth);


router.get('/:address', getAddressBalance);

module.exports = router;