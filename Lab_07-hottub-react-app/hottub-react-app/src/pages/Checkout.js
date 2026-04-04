import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useState } from "react";

export default function Checkout() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    card: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = () => {
  if (!form.name || !form.email || !form.address) {
    alert("Please fill all fields");
    return;
  }
  alert("Order Placed Successfully!");
};

  return (
    <>
      <Header />


      <div className="container checkout-page">

        <p className="breadcrumb">Home &gt; Checkout</p>

        <h2>Checkout</h2>

        <div className="checkout-layout">

          {/* LEFT FORM */}
          <div className="checkout-form">

            <h3>Billing Address</h3>

            <input name="name" placeholder="Full Name" onChange={handleChange} />
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name="address" placeholder="Address" onChange={handleChange} />
            <input name="city" placeholder="City" onChange={handleChange} />

            <h3>Payment Details</h3>

            <input name="card" placeholder="Card Number" onChange={handleChange} />
            <input placeholder="Expiry Date" />
            <input placeholder="CVV" />

          </div>

          {/* RIGHT SUMMARY */}
          <div className="order-summary">

            <h3>Order Summary</h3>

            <div className="summary-item">
              <p>Hot Tub Spa</p>
              <p>$500</p>
            </div>

            <div className="summary-item">
              <p>Accessories</p>
              <p>$100</p>
            </div>

            <hr />

            <h3>Total: $600</h3>

            <button className="btn-red" onClick={placeOrder}>
              Place Order
            </button>

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}