import React from "react";
import "./Greeting.css";

function Greeting({ name, bgColor }) {

  const hour = new Date().getHours();
  let message = "";

  if (hour < 12) {
    message = "Good Morning";
  } 
  else if (hour < 18) {
    message = "Good Afternoon";
  } 
  else {
    message = "Good Evening";
  }

  return (
    <div className="greeting-card" style={{ backgroundColor: bgColor }}>
      <h2>{message}, {name} 👋</h2>
      <p>Welcome to the Greeting App</p>
    </div>
  );
}

export default Greeting;