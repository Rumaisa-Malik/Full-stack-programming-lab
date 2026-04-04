import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import team1 from "../assets/images/team/team1.jpg";
import team2 from "../assets/images/team/team2.jpg";
import team3 from "../assets/images/team/team3.jpg";
import team4 from "../assets/images/team/team4.webp";

export default function About() {
  return (
    <>
      <Header />
      {/* REMOVE Navbar to fix duplicate */}
      
      <div className="container about-page">

        <h2>About Us</h2>

        <p className="about-text">
          We are a leading provider of premium hot tubs and spa systems.
          Our mission is to deliver relaxation and luxury to your home.
        </p>

        <div className="team-grid">

          <div className="team-card">
            <img src={team1} alt="" />
            <h4>John Smith</h4>
            <p>CEO</p>
          </div>

          <div className="team-card">
            <img src={team2} alt="" />
            <h4>Sarah Lee</h4>
            <p>Designer</p>
          </div>

          <div className="team-card">
            <img src={team3} alt="" />
            <h4>Michael Brown</h4>
            <p>Developer</p>
          </div>

          <div className="team-card">
            <img src={team4} alt="" />
            <h4>Emma Wilson</h4>
            <p>Marketing</p>
          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}