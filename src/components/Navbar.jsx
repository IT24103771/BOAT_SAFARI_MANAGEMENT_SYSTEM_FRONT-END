import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h1 className="logo">Boat Safari</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>

        {/* Show links only if logged in */}
        {isLoggedIn && (
          <>
            <Link to="/booktrip">Book Trip</Link>
            <Link to="/feedback">Feedback</Link>

            {/* Show Report link only if user is admin */}
            {user?.role === "admin" && <Link to="/report">Reports</Link>}
          </>
        )}

        {/* Show login if not logged in */}
        {!isLoggedIn ? (
          <Link to="/login">Login</Link>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
