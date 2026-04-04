import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {

    if (!form.name || !form.email || !form.password || !form.confirm) {
      alert("Fill all fields");
      return;
    }

    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }

    alert("Registered Successfully!");
    navigate("/login");
  };

  return (
    <>
      <Header />

      <div className="container auth-page">

        <h2>Register</h2>

        <div className="auth-box">

          <input name="name" placeholder="Full Name" onChange={handleChange} />

          <input name="email" placeholder="Email" onChange={handleChange} />

          <input type="password" name="password" placeholder="Password" onChange={handleChange} />

          <input type="password" name="confirm" placeholder="Confirm Password" onChange={handleChange} />

          <button className="btn-red" onClick={handleRegister}>
            REGISTER
          </button>

          <p>
            Already have an account?
            <span className="link" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>

        </div>

      </div>

      <Footer />
    </>
  );
}