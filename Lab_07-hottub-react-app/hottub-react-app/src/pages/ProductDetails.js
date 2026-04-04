import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import mainImg from "../assets/images/products/spa1.jpg";
import thumb1 from "../assets/images/products/spa1.jpg";
import thumb2 from "../assets/images/products/spa2.jpg";
import thumb3 from "../assets/images/products/spa3.jpg";

import { useState } from "react";

export default function ProductDetails() {

  const [image, setImage] = useState(mainImg);

  return (
    <>
      <Header />

      <div className="container product-page">

        {/* BREADCRUMB */}
        <p className="breadcrumb">Home &gt; Product</p>

        <h2 className="product-title">
          Emerald Bay XL TV DVD Stereo Hot Tub with 90 Jets
        </h2>

        <div className="product-layout">

          {/* LEFT IMAGE */}
          <div className="product-images">

            <img src={image} alt="" className="main-img" />

            <div className="thumbnails">
              <img src={thumb1} onClick={() => setImage(thumb1)} />
              <img src={thumb2} onClick={() => setImage(thumb2)} />
              <img src={thumb3} onClick={() => setImage(thumb3)} />
            </div>

          </div>

          {/* CENTER DETAILS */}
          <div className="product-info">

            <p className="price">$1979.00</p>

            <ul>
              <li>Seating Capacity: 5 Persons</li>
              <li>Water Capacity: 300 Gallons</li>
              <li>Number of Pumps: 2</li>
              <li>Electrical: 220V</li>
            </ul>

            <button className="btn-red">ADD TO CART</button>

          </div>

          {/* RIGHT CALCULATOR */}
          <div className="price-box">

            <h3>Price Calculator</h3>

            <select><option>Interior Color</option></select>
            <select><option>Outside Shell Color</option></select>
            <select><option>Circulation Pump</option></select>
            <select><option>Cover / Steps</option></select>
            <select><option>Jets</option></select>

            <p className="total">Total Price: $650.00</p>

            <button className="btn-red">ADD TO CART</button>

          </div>

        </div>

        {/* TABS */}
        <div className="tabs">

          <div className="tab-buttons">
            <button>Details</button>
            <button>Quick Specs</button>
            <button>Accessories</button>
            <button>Reviews</button>
            <button>Q & A</button>
          </div>

          <div className="tab-content">
            <p>
              This is Photoshop's version of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet...
            </p>
          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}