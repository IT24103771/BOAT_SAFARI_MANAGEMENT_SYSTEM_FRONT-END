import { useState } from "react";
import axios from "axios";
import "../Styles/Feedback.css";

function Feedback() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    rating: 5, // default rating
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/feedbacks", formData); // <-- fixed endpoint
      setSuccess("Thank you for your feedback!");
      setError("");
      setFormData({ name: "", email: "", message: "", rating: 5 });
    } catch (err) {
      console.error(err);
      setError("Failed to submit feedback. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="feedback-container">
      <h2>We value your feedback 📝</h2>
      <form className="feedback-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Feedback"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>

        {/* Rating */}
        <select
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          required
        >
          <option value={1}>⭐</option>
          <option value={2}>⭐⭐</option>
          <option value={3}>⭐⭐⭐</option>
          <option value={4}>⭐⭐⭐⭐</option>
          <option value={5}>⭐⭐⭐⭐⭐</option>
        </select>

        <button type="submit">Submit Feedback</button>
      </form>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Feedback;
