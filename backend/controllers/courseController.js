const Course = require("../models/Course");
const Student = require("../models/Student")
const mongoose = require("mongoose");

const fetchAllCourses = async (req, res) => {
  try {
    const studentId = req.user._id;
    const student = await Student.findById(studentId)
      .populate({
        path: "coursesEnrolled",
        model: "courses",
        populate: {
          path: "teacher",
          model: "Teacher",
          select: "firstName lastName uid _id"
        }
      });

    if (!student) {
      return res.status(404).json({ error: "Student not found!" });
    }

    const formattedCourses = student.coursesEnrolled.map(course => ({
      _id: course._id,
      title: course.title,
      description: course.description,
      code: course.code,
      thumbnail: course.thumbnail,
      introVideoUrl: course.introVideoUrl,
      teacher: course.teacher
        ? {
          firstName: course.teacher.firstName,
          lastName: course.teacher.lastName,
          email: course.teacher.email,
          role: course.teacher.role,
          _id: course.teacher._id
        }
        : null
    }));

    return res.status(200).json(formattedCourses);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};


const fetchOneCourse = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Could not find that Course!" });
  }

  const Course = await Course.findById(id).populate("Teacher");

  if (!Course) {
    return res.status(200).json({ msg: "This Course is not available!" });
  }

  return res.status(200).json(Course);
};

const createCourse = async (req, res) => {
  const {
    title,
    description,
    classId,
    slug,
    code,
    teacher,
    isPublished,
    thumbnail,
    introVideoUrl,
    enrollmentCount,
  } = req.body;

  try {
    // Validate classId and teacher ID
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ error: "Invalid class ID." });
    }
    if (!mongoose.Types.ObjectId.isValid(teacher)) {
      return res.status(400).json({ error: "Invalid teacher ID." });
    }

    // unique slug check
    const existingSlug = await Course.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({ error: "Course slug must be unique." });
    }

    // Create the course
    const newCourse = new Course({
      title,
      description,
      classId,
      slug,
      code,
      teacher,
      isPublished,
      thumbnail,
      introVideoUrl,
      enrollmentCount,
    });

    await newCourse.save();
    res.status(201).json({ message: "Course created successfully", newCourse });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error });
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
