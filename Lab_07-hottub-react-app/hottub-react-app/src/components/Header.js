import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Header() {

  const { cart } = useContext(CartContext);

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <>
      {/* TOP BAR */}
      <div className="topbar">
        <span>Call for Customer support: 020 38989565</span>

        <div className="top-links">
          <Link to="/account">My Account</Link>
          <Link to="/cart">My Cart</Link>
          <Link to="/checkout">Checkout</Link>
        </div>
      </div>

      {/* HEADER */}
      <div className="header-main">

        <div className="logo">
          <h1>HOTSPRING</h1>
          <p>Portable Spas</p>
        </div>

        <Link to="/cart">
          <div className="cart-box">
            🛒 My Cart: <b>{totalItems} items (${totalPrice})</b>
          </div>
        </Link>

      </div>

      {/* RED NAVBAR */}
      <div className="nav-red">

        <div className="nav-links">
          <Link to="/category">CATEGORY</Link>
          <Link to="/">BRAND</Link>
          <Link to="/about">INFO</Link>
        </div>

        <div className="search-box">
          <input placeholder="Search" />
          <button>SEARCH</button>
        </div>

      </div>
    </>
  );
}