const express = require('express');
const router = express.Router();

const {
  deleteCommentsByCommentId,
  patchCommentsById,
} = require('../controllers/comments.controllers');

router.delete('/:comment_id', deleteCommentsByCommentId);
router.patch('/:comment_id', patchCommentsById);

module.exports = router;
