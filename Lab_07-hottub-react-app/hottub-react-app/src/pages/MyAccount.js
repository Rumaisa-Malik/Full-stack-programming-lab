import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MyAccount() {
  return (
    <>
      <Header />

      <div className="container page">

        <h2>My Account</h2>

        <div className="account-box">

          <h3>Account Details</h3>
          <p>Name: John Doe</p>
          <p>Email: john@email.com</p>

          <h3>Orders</h3>
          <table>
            <tr>
              <td>#123</td>
              <td>$500</td>
              <td>Delivered</td>
            </tr>
          </table>

        </div>

      </div>

      <Footer />
    </>
  );
}