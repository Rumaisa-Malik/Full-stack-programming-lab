import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function EditProfile() {
  return (
    <>
      <Header />

      <div className="container page">

        <h2>Edit Profile</h2>

        <input placeholder="Name" />
        <input placeholder="Email" />

        <button className="btn-red">Save</button>

      </div>

      <Footer />
    </>
  );
}