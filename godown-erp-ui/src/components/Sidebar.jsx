import { Link } from "react-router-dom";
import "../App.css";

function Sidebar() {
  return (
    <div className="sidebar">

      <h2 className="sidebar-title">Godown ERP</h2>

      <nav className="sidebar-menu">

        <Link to="/dashboard" className="sidebar-link">
          🏠 Dashboard
        </Link>

        <Link to="/products" className="sidebar-link">
          📦 Products
        </Link>

        <Link to="/vendors" className="sidebar-link">
          🏢 Vendors
        </Link>

        <Link to="/users" className="sidebar-link">
          👤 Users
        </Link>
        
        <Link to="/inventory" className="sidebar-link">
            📦 Inventory
        </Link>
        

      </nav>

    </div>
  );
}

export default Sidebar;