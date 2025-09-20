import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <div className="home-container">
      <header className="hero">
        <h1 className="hero-title">Welcome to ALOKA AKA DEKU Safari 🚤</h1>
        <p className="hero-subtitle">Explore the beauty of nature on water</p>
        <div className="hero-buttons">
          <button className="book-btn" onClick={() => navigate("/booking")}>Book Now</button>
          {!isLoggedIn && <button className="login-btn" onClick={() => navigate("/login")}>Login</button>}
          {isLoggedIn && <button className="logout-btn" onClick={handleLogout}>Logout</button>}
        </div>
      </header>
      <section className="about">
        <h2>Why Choose Us?</h2>
        <p>Experience breathtaking boat safaris with professional guides, safe boats, and unforgettable views. Perfect for families, friends, and adventurers!</p>
      </section>
    </div>
  );
}

export default Home;
