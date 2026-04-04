import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {

  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  // REMOVE ITEM
  const removeItem = (id) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
  };

  // CHANGE QUANTITY
  const changeQty = (id, qty) => {
    const updated = cart.map(item =>
      item.id === id ? { ...item, qty: parseInt(qty) } : item
    );
    setCart(updated);
  };

  // TOTAL
  const total = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <>
      <Header />

      <div className="container cart-page">

        <p className="breadcrumb">Home &gt; Shopping Cart</p>

        <h2>Shopping Cart</h2>

        {cart.length === 0 && <p>No items in cart</p>}

        <div className="cart-table">

          {cart.map(item => (
            <div className="cart-row" key={item.id}>

              <img src={item.image} alt="" />

              <div className="cart-info">
                <h4>{item.name}</h4>
                <p>$ {item.price}</p>
              </div>

              <select
                value={item.qty}
                onChange={(e) => changeQty(item.id, e.target.value)}
              >
                {[1,2,3,4,5].map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>

              <div className="cart-price">
                $ {item.price * item.qty}
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="remove-btn"
              >
                Remove
              </button>

            </div>
          ))}

        </div>

        <div className="cart-summary">
          <h3>Total: $ {total}</h3>

          <div className="cart-buttons">
            <button onClick={() => navigate("/")}>
              Continue Shopping
            </button>

            <button
              className="btn-red"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
}