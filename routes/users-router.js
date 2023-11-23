const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserByUsername,
} = require('../controllers/users.controllers');

router.get('/', getUsers);
router.get('/:username', getUserByUsername);

module.exports = router;
