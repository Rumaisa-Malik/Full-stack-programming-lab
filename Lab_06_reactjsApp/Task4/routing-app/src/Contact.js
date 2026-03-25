import { useState } from "react";
import "./App.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert("Message Sent!");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="container">
      <h2>📞 Contact Us</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <textarea name="message" placeholder="Message" value={form.message} onChange={handleChange} />

        <button className="btn">Send Message</button>
      </form>
    </div>
  );
}

export default Contact;