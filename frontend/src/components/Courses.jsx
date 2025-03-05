import React, { useCallback, useEffect, useState } from "react";

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = JSON.parse(localStorage.getItem("token"));

  const fetchCourses = useCallback(async () => {
    try {
      const response = await fetch("/api/courses/fetch", {
        method: 'GET',
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Error fetching courses!");
      }
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="courses-container">
      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        courses.map((course) => (
          <div key={course._id} className="schedule-card card-1x1">
            <img src={course.thumbnail} alt="course-thumbnail" />
              <h3>{course.title} ({course.code})</h3>
              <p>{course.description}</p>
              <p>
                <span className="material-symbols-outlined">school</span>
                Teacher: {course.teacher.name}
              </p>
          </div>
        ))
      )}
    </div>
  );
};
