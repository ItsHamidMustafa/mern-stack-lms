const express = require('express');
const router = express.Router();
const checkRole = require("../middlewares/checkRole");
const { requireAuth } = require('../middlewares/requireAuth');
const { loginAdmin, signupAdmin, deleteTeacher, createTeacher, fetchAllTeachers, approveStudent } = require('../controllers/adminController');

router.get('/fetch-teachers', requireAuth, checkRole(['admin']), fetchAllTeachers);
router.post('/login', loginAdmin);
router.post('/signup', signupAdmin);
router.delete('/delete-teacher/:id', requireAuth, checkRole(['admin']), deleteTeacher);
router.post('/create-teacher', requireAuth, checkRole(['admin']), createTeacher);
router.put('/approve-student/:id', approveStudent)

module.exports = router;