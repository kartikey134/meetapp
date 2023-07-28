const express = require('express');
const { signup, login } = require('../controllers/user');
const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);

module.exports = router;