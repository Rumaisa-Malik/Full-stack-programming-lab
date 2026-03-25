import { useState } from "react";
import "./App.css";

function Actions() {
  const [message, setMessage] = useState("");

  // Background changer (BODY instead of card)
  function changeBackground() {
    document.body.style.background =
      "linear-gradient(135deg, #e6d6ff, #c4b5fd, #a78bfa)"; // lilac theme
  }

  return (
    <div className="container">
      <h2>Interactive Panel</h2>

      <div className="btn-group">
        <button className="btn" onClick={() => setMessage("Hello User!")}>
          Show Message
        </button>

        <button className="btn" onClick={changeBackground}>
          Change Background
        </button>

        <button className="btn" onClick={() => alert("Alert Triggered!")}>
          Alert
        </button>
      </div>

      <p className="message">{message}</p>
    </div>
  );
}

export default Actions;