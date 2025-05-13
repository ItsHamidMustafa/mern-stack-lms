import React, { useState, useEffect } from "react";

export const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [scheduleDay, setScheduleDay] = useState("Monday");

  const fetchClass = async (token) => {
    try {
      const response = await fetch("/api/class/fetch", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Error fetching data");
        return;
      }

      const data = await response.json();
      setSchedule(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));

    if (token) {
      fetchClass(token);
    }
  }, []);

  return (
    <div className="sub-component">
      <span className="font-size-large">Schedule</span>
      <div className="schedules-container">
        <div className="schedules-navigator">
          <button
            className={scheduleDay === "Monday" ? "active" : ""}
            onClick={() => setScheduleDay("Monday")}
          >
            Monday
          </button>
          <button
            className={scheduleDay === "Tuesday" ? "active" : ""}
            onClick={() => setScheduleDay("Tuesday")}
          >
            Tuesday
          </button>
          <button
            className={scheduleDay === "Wednesday" ? "active" : ""}
            onClick={() => setScheduleDay("Wednesday")}
          >
            Wednesday
          </button>
          <button
            className={scheduleDay === "Thursday" ? "active" : ""}
            onClick={() => setScheduleDay("Thursday")}
          >
            Thursday
          </button>
          <button
            className={scheduleDay === "Friday" ? "active" : ""}
            onClick={() => setScheduleDay("Friday")}
          >
            Friday
          </button>
        </div>
        <div className="sub-component-container">
          {schedule?.schedule ? (
            (() => {
              const selectedDay = schedule?.schedule.find(
                (dayItem) => dayItem.day === scheduleDay,
              );

              if (!selectedDay || selectedDay.lectures.length === 0) {
                return (
                  <div className="schedule-card">
                    <p>No class for today!</p>
                  </div>
                );
              }
              return selectedDay.lectures.map((lecture, index) => (
                <div key={index} className="schedule-card">
                  <p>
                    <span className="material-symbols-outlined">book_5</span>
                    Subject: {lecture.subject} ({lecture.courseCode})
                  </p>
                  <p>
                    <span className="material-symbols-outlined">school</span>
                    Teacher: {lecture.teacherId?.firstName + " " + lecture.teacherId?.lastName || "Unknown"}
                  </p>
                  <p>
                    <span className="material-symbols-outlined">door_back</span>
                    Room: {lecture.roomId}
                  </p>
                  <p>
                    <span className="material-symbols-outlined">schedule</span>
                    Time: {new Date(lecture.from).toLocaleTimeString()} -{" "}
                    {new Date(lecture.to).toLocaleTimeString()}
                  </p>
                  <p>
                    <span className="material-symbols-outlined">notes</span>
                    Notes: {lecture.notes}
                  </p>
                </div>
              ));
            })()
          ) : (
            <div className="schedule-card">
              <p>Loading schedule...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
