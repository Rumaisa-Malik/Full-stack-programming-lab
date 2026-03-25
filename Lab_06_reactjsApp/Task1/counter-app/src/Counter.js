import { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaMinus, FaRedo } from "react-icons/fa";
import "./App.css";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>Smart Counter</h2>

      <motion.h1
        animate={{ scale: [1, 1.2, 1] }}
        key={count}
      >
        {count}
      </motion.h1>

      <button className="btn green" onClick={() => setCount(count + 1)}>
        <FaPlus /> Increment
      </button>

      <button className="btn red" onClick={() => count > 0 && setCount(count - 1)}>
        <FaMinus /> Decrement
      </button>

      <button className="btn primary" onClick={() => setCount(0)}>
        <FaRedo /> Reset
      </button>
    </motion.div>
  );
}

export default Counter;