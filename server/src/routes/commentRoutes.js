const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const comments = require('../controllers/commentController');
const { checkTaskAccess } = require('../middleware/accessMiddleware');
const { requireFields } = require('../middleware/validate')

router.post('/task/:taskId', auth, checkTaskAccess,
    requireFields('content'),
    comments.createComment
);

router.patch('/:commentId', auth,
    requireFields('content'),
    comments.updateComment
);
router.get('/task/:taskId', auth, checkTaskAccess, comments.getTaskComments);
router.delete('/:commentId', auth, comments.deleteComment);

module.exports = router;