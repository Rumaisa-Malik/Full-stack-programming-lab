import React from "react";
import "./CourseItem.css";

function CourseItem(props) {
  return (
    <div className="course-card">
      <h2>{props.courseName}</h2>
      <p><strong>Instructor:</strong> {props.instructor}</p>
      <p><strong>Duration:</strong> {props.duration}</p>
      <p className="type">{props.type}</p>
    </div>
  );
}

export default CourseItem;