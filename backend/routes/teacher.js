const express = require('express');
const router = express.Router();
const checkRole = require('../middlewares/checkRole');
const auth = require('../middlewares/requireAuth');
const { signupTeacher, loginTeacher, createTeacher, updateTeacher, deleteTeacher, fetchAll } = require('../controllers/teacherController');

router.get('/fetch', auth, fetchAll);
router.post('/create', createTeacher);
router.post('/signup', signupTeacher);
router.post('/login', loginTeacher);
router.patch('/update/:id', auth, checkRole([1, 2]), updateTeacher);
router.delete('/delete/:id', auth, checkRole([1, 2]), deleteTeacher);

module.exports = router;