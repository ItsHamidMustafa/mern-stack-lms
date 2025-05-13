const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middlewares/requireAuth');
const { signupTeacher, loginTeacher, fetchCurrentTeacher, fetchOne } = require('../controllers/teacherController');

router.get('/me', requireAuth, fetchCurrentTeacher);
router.post('/signup', signupTeacher);
router.post('/login', loginTeacher);
router.get('/fetch/:id', fetchOne);

module.exports = router;