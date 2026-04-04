import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function ProductCard({ product }) {

  const { cart, setCart } = useContext(CartContext);

  const addToCart = () => {

    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      const updated = cart.map(item =>
        item.id === product.id
          ? { ...item, qty: item.qty + 1 }
          : item
      );
      setCart(updated);
    } else {
      setCart([
        ...cart,
        { ...product, price: 500, qty: 1 }
      ]);
    }
  };

  return (
    <div className="product-card">

      <img src={product.image} alt="" />

      <div className="product-info">
        <h4>{product.name}</h4>
        <p className="price">$500</p>

        <button className="add-btn" onClick={addToCart}>
          ADD TO CART
        </button>
      </div>

    </div>
  );
}