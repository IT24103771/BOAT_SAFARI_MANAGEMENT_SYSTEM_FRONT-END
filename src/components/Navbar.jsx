import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Load user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [isLoggedIn]);

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
        <Link to="/booktrip">Book Trip</Link>
        <Link to="/feedback">Feedback</Link>

        {!isLoggedIn ? (
          <Link to="/login">Login</Link>
        ) : (
          <>
            {/* Show Admin Panel link if user is admin */}
            {user?.role === "ADMIN" && <Link to="/admin">Admin Panel</Link>}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
