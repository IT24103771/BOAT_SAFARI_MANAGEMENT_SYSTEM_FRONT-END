import "../Styles/Booking.css";
import { useState, useEffect } from "react";

function Booking() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    passengers: 1,
    boatId: "",
    timeId: ""
  });

  const [boats, setBoats] = useState([]);
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch boats
    fetch("http://localhost:8080/api/boats")
      .then(res => res.json())
      .then(data => setBoats(data))
      .catch(err => console.error("Error fetching boats:", err));

    // Fetch available times
    fetch("http://localhost:8080/api/times")
      .then(res => res.json())
      .then(data => setTimes(data))
      .catch(err => console.error("Error fetching times:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("✅ Booking submitted successfully!");
        setFormData({
          name: "",
          email: "",
          date: "",
          passengers: 1,
          boatId: "",
          timeId: ""
        });
      } else {
        const errMsg = await response.text();
        alert("❌ Error submitting booking: " + errMsg);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ Something went wrong! Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-container">
      <h2>Boat Safari Booking</h2>
      <form className="booking-form" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Date of Safari:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label>Number of Passengers:</label>
        <input
          type="number"
          name="passengers"
          min="1"
          value={formData.passengers}
          onChange={handleChange}
          required
        />

        <label>Select Boat:</label>
        <select
          name="boatId"
          value={formData.boatId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Boat --</option>
          {boats.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} (Capacity: {b.capacity}, Type: {b.boatType})
            </option>
          ))}
        </select>

        <label>Select Time:</label>
        <select
          name="timeId"
          value={formData.timeId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Time --</option>
          {times.map((t) => (
            <option key={t.id} value={t.id}>
              {t.time}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Book Now"}
        </button>
      </form>
    </div>
  );
}

export default Booking;
