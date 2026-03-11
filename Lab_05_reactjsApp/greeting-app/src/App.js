import React from "react";
import Greeting from "./components/Greeting";
import "./App.css";

function App() {
  return (
    <div className="app">

      <h1>🌟 Dynamic Greeting App</h1>

      <div className="greeting-container">

        <Greeting 
          name="Ali"
          bgColor="#FFE4B5"
        />

        <Greeting 
          name="Sara"
          bgColor="#ADD8E6"
        />

        <Greeting 
          name="Ahmed"
          bgColor="#D8BFD8"
        />

      </div>

    </div>
  );
}

export default App;