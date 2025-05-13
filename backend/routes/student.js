const express = require("express");
const router = express.Router();
const checkRole = require("../middlewares/checkRole");
const { requireAuth } = require("../middlewares/requireAuth");
const {
  fetchOneStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  fetchAll,
  loginStudent,
  signupStudent,
} = require("../controllers/studentController");

router.get("/fetch", requireAuth, fetchAll);
// router.get("/me", requireAuth, fetchCurrentStudent);
router.get("/fetch/:id", requireAuth, fetchOneStudent);
router.post("/create", createStudent);
router.post("/login", loginStudent);
router.post("/signup", signupStudent);
router.patch("/update/:id", requireAuth, checkRole(["admin"]), updateStudent);
router.delete("/delete/:id", requireAuth, checkRole(["admin"]), deleteStudent);

module.exports = router;
