const express = require("express");
const router = express.Router();
const checkRole = require("../middlewares/checkRole");
const auth = require("../middlewares/requireAuth");
const {
  fetchOneStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  fetchAll,
  loginStudent,
  signupStudent,
  fetchCurrentStudent,
} = require("../controllers/studentController");

router.get("/fetch", auth, fetchAll);
router.get("/me", auth, fetchCurrentStudent);
router.get("/fetch/:id", auth, fetchOneStudent);
router.post("/create", createStudent);
router.post("/login", loginStudent);
router.post("/signup", signupStudent);
router.patch("/update/:id", auth, checkRole(["admin"]), updateStudent);
router.delete("/delete/:id", auth, checkRole(["admin"]), deleteStudent);

module.exports = router;
