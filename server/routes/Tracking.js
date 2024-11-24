// routes/Tracking.js
const express = require('express');
const router = express.Router();
const { getTransactions, queryTransactions } = require('../controllers/trackingController.js');
//const requireAuth = require('../middleware/requireAuth');

// Aplicar middleware de autenticación
//router.use(requireAuth);

router.get('/:address/transactions', getTransactions);
router.get('/query', queryTransactions);


module.exports = router;