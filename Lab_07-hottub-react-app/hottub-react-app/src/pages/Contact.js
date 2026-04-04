import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  return (
    <>
      <Header />

      <div className="container page">

        <h2>Contact Us</h2>

        <div className="contact-form">
          <input placeholder="Your Name" />
          <input placeholder="Email" />
          <textarea placeholder="Message"></textarea>

          <button className="btn-red">Send Message</button>
        </div>

      </div>

      <Footer />
    </>
  );
}