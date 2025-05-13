const express = require('express');
const router = express.Router();
const checkRole = require("../middlewares/checkRole");
const { requireAuth } = require('../middlewares/requireAuth');
const { createProgram, fetchAllPrograms, fetchProgramsByDepartment, deleteProgram } = require('../controllers/programController');

router.post('/create-program', requireAuth, checkRole(['admin']), createProgram);
router.get('/fetch-programs', fetchAllPrograms);
router.get('/fetch-programs-by-department/:departmentId', requireAuth, fetchProgramsByDepartment);
router.delete('/delete-program/:id', requireAuth, checkRole(['admin']), deleteProgram);

module.exports = router;