import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

// IMAGES
import hero from "../assets/images/banners/hero.jpg";
import spa1 from "../assets/images/products/spa1.jpg";
import spa2 from "../assets/images/products/spa2.jpg";
import spa3 from "../assets/images/products/spa3.jpg";
import spa4 from "../assets/images/products/spa4.jpg";

// 🔥 FIXED LOGO IMPORTS
import oceanic from "../assets/images/logos/oceanic.png";
import caldera from "../assets/images/logos/caldera.png";
import island from "../assets/images/logos/island.png";

export default function Home() {

  // 🔥 SAFE PRODUCTS (prevents undefined crash)
  const products = [
    { id: 1, name: "XS SCYBA X SERIES 119", image: spa1 || "" },
    { id: 2, name: "XS SCYBA X SERIES 119", image: spa2 || "" },
    { id: 3, name: "XS SCYBA X SERIES 119", image: spa3 || "" },
    { id: 4, name: "XS SCYBA X SERIES 119", image: spa4 || "" },
  ];

  return (
    <>
      <Header />

      <div className="container">

        {/* HERO */}
        <div className="hero">
          <img src={hero} alt="Hero Banner" />
          <div className="hero-text">
            <h1>Barrier Reef 158 Jet</h1>
            <p>$4899.00</p>
            <button className="btn-red">More Details</button>
          </div>
        </div>

        {/* FEATURE BOXES */}
        <div className="features">
          <div className="feature blue">5-7 PERSON SPA</div>
          <div className="feature dark">TV THEATER SPA</div>
          <div className="feature red">SAVE 50%</div>
        </div>

        {/* PRODUCTS */}
        <h2>NEW PRODUCTS</h2>
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* 🔥 FIXED LOGOS */}
        <div className="brands">
          <img src={oceanic} alt="Oceanic" />
          <img src={caldera} alt="Caldera" />
          <img src={island} alt="Island" />
        </div>

      </div>

      <Footer />
    </>
  );
}