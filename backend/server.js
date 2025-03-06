require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const courseRoutes = require("./routes/course");
const teacherRoutes = require("./routes/teacher");
const studentRoutes = require("./routes/student");
// const scheduleRoutes = require("./routes/schedule");
const classRoutes = require("./routes/class");
const helpRoutes = require("./routes/help");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

// app.use('/api/users', userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/students", studentRoutes);
// app.use("/api/schedule", scheduleRoutes);
app.use("/api/class", classRoutes);
app.use("/api/help", helpRoutes);

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
