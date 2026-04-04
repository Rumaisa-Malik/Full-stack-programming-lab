import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import SidebarFilter from "../components/SidebarFilter";

import spa1 from "../assets/images/products/spa1.jpg";
import spa2 from "../assets/images/products/spa2.jpg";
import spa3 from "../assets/images/products/spa3.jpg";
import spa4 from "../assets/images/products/spa4.jpg";

export default function Category() {

  const products = [
    { id: 1, name: "XS SCYBA X SERIES 119", image: spa1 },
    { id: 2, name: "XS SCYBA X SERIES 119", image: spa2 },
    { id: 3, name: "XS SCYBA X SERIES 119", image: spa3 },
    { id: 4, name: "XS SCYBA X SERIES 119", image: spa4 },
    { id: 5, name: "XS SCYBA X SERIES 119", image: spa1 },
    { id: 6, name: "XS SCYBA X SERIES 119", image: spa2 },
  ];

  return (
    <>
      <Header />

      <div className="category-wrapper">

        {/* LEFT SIDEBAR */}
        <div className="sidebar">
          <SidebarFilter />
        </div>

        {/* RIGHT CONTENT */}
        <div className="category-content">

          <div className="category-header">
            <h2>Top Product Listing</h2>
            <select>
              <option>Show 9</option>
              <option>Show 12</option>
            </select>
          </div>

          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}
