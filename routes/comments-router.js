const express = require('express');
const router = express.Router();

const {
  deleteCommentsByCommentId,
} = require('../controllers/comments.controllers');

router.delete('/:comment_id', deleteCommentsByCommentId);

module.exports = router;
