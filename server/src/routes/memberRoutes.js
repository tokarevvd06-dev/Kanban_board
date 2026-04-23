const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const members = require('../controllers/memberController');
const { checkBoardAccess } = require('../middleware/accessMiddleware');

router.post('/:boardId', auth, checkBoardAccess, members.addMember);
router.get('/:boardId', auth, checkBoardAccess, members.getMembers);
router.delete('/:boardId/:userId', auth, checkBoardAccess, members.removeMember);
module.exports = router;