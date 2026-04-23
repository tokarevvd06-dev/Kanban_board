const express = require('express');
const { register, login } = require('../controllers/authController');
const { requireFields } = require('../middleware/validate')

const router = express.Router();

router.post('/register', requireFields('email', 'password', 'name'), register);
router.post('/login', requireFields('email', 'password'), login);

module.exports = router;