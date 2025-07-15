require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const courseRoutes = require("./routes/course");
const teacherRoutes = require("./routes/teacher");
const studentRoutes = require("./routes/student");
const classRoutes = require("./routes/class");
const helpRoutes = require("./routes/help");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require('./routes/adminRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const programRoutes = require('./routes/programRoutes');
const userRoutes = require('./routes/user');

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/courses", courseRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use('/api/admins', adminRoutes);
app.use("/api/class", classRoutes);
app.use("/api/help", helpRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/user', userRoutes);


mongoose
  .connect(process.env.MONG_URI, {
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Connected and listening on ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Error connecting to database ${process.env.MONG_URI}`);
  });

module.exports = app;
