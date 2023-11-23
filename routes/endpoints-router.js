const express = require('express');
const router = express.Router();
const { getEndpoints } = require('../controllers/endpoints.controller');

router.get('/', getEndpoints);

module.exports = router;
