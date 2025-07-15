const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/requireAuth');
const { loginUser, fetchCurrentUser } = require('../controllers/userController');

router.get('/me', requireAuth, fetchCurrentUser);
router.post('/login', loginUser);

module.exports = router;