const express = require('express');
const router = express.Router();
const { convertCLPtoUSD } = require('../controllers/currencyController');

router.get('/convert', convertCLPtoUSD);

module.exports = router; 