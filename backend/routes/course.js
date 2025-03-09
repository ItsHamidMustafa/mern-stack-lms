const express = require("express");
const router = express.Router();
const isAdmin = require("../middlewares/checkRole");
const auth = require("../middlewares/requireAuth");
const {
  fetchAllCourses,
  fetchOneCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

router.get("/fetch", auth, fetchAllCourses);
router.get("/fetch/:id", fetchOneCourse);
router.post("/create", auth, createCourse);
router.patch("/update/:id", auth, isAdmin, updateCourse);
router.delete("/delete/:id", auth, isAdmin, deleteCourse);

module.exports = router;
