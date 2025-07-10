import React, { useCallback, useEffect, useState } from "react";
import loadingGif from '../media/loader.gif';
import { Link } from "react-router-dom";

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
    return (
      <div className='loading-container'>
        <img src={loadingGif} alt="loader" className='loading' />
      </div>
    )
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="courses-container">
      {courses.length === 0 ? (
        <div className="error">No courses available.</div>
      ) : (
        courses.map((course) => (
          <div key={course._id} className="schedule-card card-1x1">
            <img src={course.thumbnail} alt="course-thumbnail" />
            <h3>{course.title} ({course.code})</h3>
            <p>{course.description}</p>
            <Link to={'/teacher/' + course.teacher._id} className='col-white w-100p'>
              <p>
                <span className="material-symbols-outlined">school</span>
                Teacher: {course.teacher?.firstName + " " + course.teacher?.lastName}
              </p>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};
