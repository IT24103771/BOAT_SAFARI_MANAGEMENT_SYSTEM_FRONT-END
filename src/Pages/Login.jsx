import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/Login.css";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        formData,
        { validateStatus: () => true }
      );

      if (response.status === 200 && response.data) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(response.data));
        setIsLoggedIn(true);

        if (response.data.role === "ADMIN") navigate("/admin");
        else navigate("/");
      } else if (response.status === 401) setError("Invalid email or password.");
      else setError("Login failed. Please try again.");
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Boat Safari</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required />
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
          <button type="submit">Login</button>
        </form>
        <p className="register-text">Don’t have an account?</p>
        <button className="register-btn" onClick={() => navigate("/register")}>Register Here</button>
      </div>
    </div>
  );
}

export default Login;
