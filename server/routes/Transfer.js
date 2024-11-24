const express = require('express');
const router = express.Router();
const { prepareTransfer } = require('../controllers/transferController');

// Ruta para transferir tokens
router.post('/', prepareTransfer);

module.exports = router;