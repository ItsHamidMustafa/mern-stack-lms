const express = require('express');
const router = express.Router();
const checkRole = require("../middlewares/checkRole");
const { requireAuth } = require('../middlewares/requireAuth');
const { createDepartment, fetchDepartments, deleteDepartment } = require('../controllers/departmentController');

router.post('/create-department', requireAuth, checkRole(['admin']), createDepartment);
router.get('/fetch-departments', fetchDepartments);
router.delete('/delete-department/:id', requireAuth, checkRole(['admin']), deleteDepartment);
module.exports = router;