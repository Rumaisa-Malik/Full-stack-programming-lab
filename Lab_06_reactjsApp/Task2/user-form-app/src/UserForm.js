import { useState } from "react";
import { motion } from "framer-motion";

function UserForm() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [submitted, setSubmitted] = useState(null);

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(user);
    setUser({ name: "", email: "" });
  }

  return (
    <motion.div className="container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2>User Registration</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="👤 Name" value={user.name} onChange={handleChange} />
        <input name="email" placeholder="📧 Email" value={user.email} onChange={handleChange} />
        <button className="btn primary">Submit</button>
      </form>

      {submitted && (
        <motion.div className="card" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
          <h3>Submitted Data</h3>
          <p>{submitted.name}</p>
          <p>{submitted.email}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default UserForm;