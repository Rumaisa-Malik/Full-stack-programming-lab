import "./App.css";

function Products() {
  return (
    <div className="container">
      <h2>🛒 Products</h2>

      <div className="card">
        <h3>Product 1</h3>
        <p>High quality item</p>
        <button className="btn">Add to Cart</button>
      </div>

      <div className="card">
        <h3>Product 2</h3>
        <p>Affordable and reliable</p>
        <button className="btn">Add to Cart</button>
      </div>
    </div>
  );
}

export default Products;