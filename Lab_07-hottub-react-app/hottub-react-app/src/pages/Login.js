import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    alert("Login Successful!");
    navigate("/"); // redirect to home
  };

  return (
    <>
      <Header />

      <div className="container auth-page">

        <h2>Login</h2>

        <div className="auth-box">

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button className="btn-red" onClick={handleLogin}>
            LOGIN
          </button>

          <p className="link" onClick={() => navigate("/forgot")}>
            Forgot Password?
          </p>

          <p>
            Don’t have an account?
            <span className="link" onClick={() => navigate("/register")}>
              Register
            </span>
          </p>

        </div>

      </div>

      <Footer />
    </>
  );
}