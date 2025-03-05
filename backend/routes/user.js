const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');
const { fetchCurrentUser, loginUser, signupUser, updateUser } = require('../controllers/userController');

router.get('/me', requireAuth, fetchCurrentUser);
router.post('/login', loginUser);
router.post('/signup', signupUser);
router.patch('/update/:id', requireAuth, updateUser);

module.exports = router;