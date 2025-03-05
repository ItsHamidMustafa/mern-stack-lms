const Course = require("../models/Course");
const Student = require("../models/Student")
const mongoose = require("mongoose");

const fetchAllCourses = async (req, res) => {
  try {
    const studentId = req.student._id;
    const student =
      await Student.findById(studentId).populate({
        path: "coursesEnrolled",
        model: "courses",
        populate: {
          path: "teacher",
          model: "teachers"
        }
      });
    if (!student) {
      return res.status(404).json({ error: "Student not found!" });
    }

    return res.status(200).json(student.coursesEnrolled);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const fetchOneCourse = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Could not find that Course!" });
  }

  const Course = await Course.findById(id).populate("teacher");

  if (!Course) {
    return res.status(200).json({ msg: "This Course is not available!" });
  }

  return res.status(200).json(Course);
};

const createCourse = async (req, res) => {
  const {
    title,
    description,
    category,
    level,
    teacher,
    modules,
    duration,
    language,
    tags,
    thumbnail,
    introVideoUrl,
    completionCertificate,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(category)) {
    res.status(400).json({
      error: "Invalid category, check if that category already exists!",
    });
    return;
  }

  try {
    const Course = await Course.create({
      title,
      description,
      category,
      level,
      teacher,
      modules,
      duration,
      language,
      tags,
      thumbnail,
      introVideoUrl,
      completionCertificate,
    });

    res.status(200).json(Course);
    return;
  } catch (err) {
    res
      .status(401)
      .json({ error: "Error creating Course, double check all the inputs!" });
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      error: "We're sorry, but the Course id you entered is invalid!",
    });
  }

  const updatedCourseData = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    level: req.body.level,
    teacher: req.body.teacher,
    modules: req.body.modules,
    duration: req.body.duration,
    language: req.body.language,
    tags: req.body.tags,
    thumbnail: req.body.thumbnail,
    introVideoUrl: req.body.introVideoUrl,
    completionCertificate: req.body.completionCertificate,
  };

  try {
    const Course = await Course.findOneAndUpdate(
      { _id: id },
      updatedCourseData,
      { new: true },
    );

    if (!Course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(Course);
  } catch (error) {
    res.status(400).json({ error: "Failed to update Course" });
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Course ID is not valid!" });
  }

  try {
    await Course.findByIdAndDelete(id);
    res.status(200).json({ message: "Course deleted successfully!" });
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  fetchAllCourses,
  fetchOneCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
