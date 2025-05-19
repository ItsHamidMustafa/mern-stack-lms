const express = require('express');
const router = express.Router();
const checkRole = require("../middlewares/checkRole");
const { requireAuth } = require('../middlewares/requireAuth');
const { loginAdmin, signupAdmin, deleteTeacher, createTeacher, fetchAllTeachers, approveStudent } = require('../controllers/adminController');
const { createStudent, updateStudent, deleteStudent, fetchAllStudents } = require('../controllers/studentController');


// Admin routes
router.post('/login', loginAdmin);
router.post('/signup', signupAdmin);

// Teacher routes
router.get('/fetch-teachers', requireAuth, checkRole(['admin']), fetchAllTeachers);
router.delete('/delete-teacher/:id', requireAuth, checkRole(['admin']), deleteTeacher);
router.post('/create-teacher', requireAuth, checkRole(['admin']), createTeacher);

// Student routes
router.put('/approve-student/:id', approveStudent);
router.post("/create", createStudent);
router.patch("/update/:id", requireAuth, checkRole(["admin"]), updateStudent);
router.delete("/delete/:id", requireAuth, checkRole(["admin"]), deleteStudent);
router.get("/fetch", requireAuth, checkRole(["admin"]), fetchAllStudents);
module.exports = router;