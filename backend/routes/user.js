const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/requireAuth');
const { login, fetchCurrentUser, updateOwnPassword } = require('../controllers/authController');

router.get('/me', requireAuth, fetchCurrentUser);
router.post('/login', login);

module.exports = router;