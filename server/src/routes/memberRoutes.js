const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const members = require('../controllers/memberController');

router.post('/:boardId', auth, members.addMember);
router.get('/:boardId', auth, members.getMembers);
router.delete('/:boardId/:userId', auth, members.removeMember);

module.exports = router;