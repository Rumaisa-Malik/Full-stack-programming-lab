export default function Navbar() {
  return (
    <div className="navbar">
      <div className="container nav-inner">

        <div className="logo">
          HOTSPRING
          <span>Portable Spas</span>
        </div>

        <div className="nav-menu">
          <a href="/">HOME</a>
          <a href="/category">CATEGORY</a>
          <a href="/about">INFO</a>
        </div>

        <div className="search">
          <input type="text" placeholder="Search" />
          <button>SEARCH</button>
        </div>

      </div>
    </div>
  );
}