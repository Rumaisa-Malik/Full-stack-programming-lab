import React from "react";
import CourseItem from "./components/CourseItem";
import "./App.css";

function App() {

  const courses = [
    { courseName: "Web Development", instructor: "John Smith", duration: "8 weeks", type: "Online" },
    { courseName: "Data Structures", instructor: "Dr. Ahmed", duration: "10 weeks", type: "Offline" },
    { courseName: "Machine Learning", instructor: "Sarah Lee", duration: "12 weeks", type: "Online" },
    { courseName: "Database Systems", instructor: "Ali Khan", duration: "6 weeks", type: "Offline" },
    { courseName: "Mobile App Development", instructor: "Michael Brown", duration: "9 weeks", type: "Online" }
  ];

  return (
    <div className="app">
      <h1>📚 Course List</h1>

      <div className="course-container">
        {courses.map((course, index) => (
          <CourseItem
            key={index}
            courseName={course.courseName}
            instructor={course.instructor}
            duration={course.duration}
            type={course.type}
          />
        ))}
      </div>

    </div>
  );
}

export default App;