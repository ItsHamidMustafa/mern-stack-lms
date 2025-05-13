const express = require("express");
const router = express.Router();
const checkRole = require("../middlewares/checkRole");
const { requireAuth } = require("../middlewares/requireAuth");
const {
  fetchAllCourses,
  fetchOneCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

router.get("/fetch", requireAuth, fetchAllCourses);
router.get("/fetch/:id", fetchOneCourse);
router.post("/create", requireAuth, checkRole(['admin']), createCourse);
router.patch("/update/:id", requireAuth, checkRole(['admin']), updateCourse);
router.delete("/delete/:id", requireAuth, checkRole(['admin']), deleteCourse);

module.exports = router;