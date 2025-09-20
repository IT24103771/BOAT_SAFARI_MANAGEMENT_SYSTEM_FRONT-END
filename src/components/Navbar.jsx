import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">Boat Safari</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/booking">Booking</Link>
        <Link to="/login">Login</Link> {/* lowercase */}
        <Link to="/register">Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;
