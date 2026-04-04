import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
// PAGES
import Home from "./pages/Home";
import Category from "./pages/Category";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";

import MyAccount from "./pages/MyAccount";
import EditProfile from "./pages/EditProfile";
import EditBilling from "./pages/EditBilling";
import EditShipping from "./pages/EditShipping";

import OrderSummary from "./pages/OrderSummary";
import OrderDetails from "./pages/OrderDetails";

import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>

        {/* MAIN PAGES */}
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<Category />} />
        <Route path="/product" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* INFO */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />

        {/* ACCOUNT */}
        <Route path="/account" element={<MyAccount />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/edit-billing" element={<EditBilling />} />
        <Route path="/edit-shipping" element={<EditShipping />} />

        {/* ORDERS */}
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/order-details" element={<OrderDetails />} />

        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;