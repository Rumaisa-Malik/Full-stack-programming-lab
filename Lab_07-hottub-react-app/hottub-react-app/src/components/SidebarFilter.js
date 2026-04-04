export default function SidebarFilter() {
  return (
    <div className="sidebar">

      <h3>Shopping Options</h3>

      <div className="filter-section">
        <h4>SEATING CAPACITY</h4>
        <ul>
          <li>2 - 4 PEOPLE</li>
          <li>5 - 7 PEOPLE</li>
          <li>8 PEOPLE AND MORE</li>
        </ul>
      </div>

      <div className="filter-section">
        <h4>CHOOSE SIZES</h4>
        <ul>
          <li>5 - 6 FEET LONG</li>
          <li>6 - 7 FEET LONG</li>
          <li>7 - 8 FEET LONG</li>
        </ul>
      </div>

      <div className="filter-section">
        <h4>SPAS BY TYPE</h4>
        <ul>
          <li>PORTABLE SPAS</li>
          <li>CORNER SPAS</li>
          <li>DEEPER SPAS</li>
        </ul>
      </div>

      <div className="filter-section">
        <h4>PRICE RANGES</h4>
        <ul>
          <li>UNDER $3,000</li>
          <li>$3,000 TO $4,000</li>
          <li>$4,000 TO $5,000</li>
        </ul>
      </div>

    </div>
  );
}