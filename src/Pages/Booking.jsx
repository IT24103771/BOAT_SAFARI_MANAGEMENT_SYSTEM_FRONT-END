import "../Styles/Booking.css";
import { useState, useEffect } from "react";

function Booking({ setShowBooking, trip }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    adults: 1,
    children: 0,
    boatId: "",
    tripId: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const [loading, setLoading] = useState(false);
  const [boats, setBoats] = useState([]);
  const [trips, setTrips] = useState([]);

  // Fetch available boats and trips
  useEffect(() => {
    fetch("http://localhost:8080/api/boats")
      .then(res => res.json())
      .then(data => setBoats(data))
      .catch(err => console.error("Error fetching boats:", err));

    fetch("http://localhost:8080/api/trips")
      .then(res => res.json())
      .then(data => setTrips(data))
      .catch(err => console.error("Error fetching trips:", err));
  }, []);

  const totalPrice =
    (formData.adults * (trip?.adultPrice || 0)) +
    (formData.children * (trip?.childPrice || 0)) +
    (boats.find(b => b.id === Number(formData.boatId))?.price || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: Number(value) || value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convert selected boatId and tripId to objects
    const selectedBoat = boats.find(b => b.id === Number(formData.boatId)) || null;
    const selectedTrip = trips.find(t => t.id === Number(formData.tripId)) || null;

    const bookingData = {
      name: formData.name,
      email: formData.email,
      safariDate: formData.date,
      adults: formData.adults,
      children: formData.children,
      totalPrice,
      boat: selectedBoat ? { id: selectedBoat.id } : null,
      trip: selectedTrip ? { id: selectedTrip.id } : null,
      cardNumber: formData.cardNumber,
      expiry: formData.expiry,
      cvv: formData.cvv
    };

    try {
      const response = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        alert("✅ Booking submitted successfully!");
        setShowBooking(false);
      } else {
        const errMsg = await response.text();
        alert("❌ Error: " + errMsg);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (!trip) return null;

  return (
    <div className="modal-overlay">
      <div className="booking-container">
        <button className="close-btn" onClick={() => setShowBooking(false)}>×</button>
        <h2>Booking: {trip.name}</h2>
        <p>Type: {trip.type}</p>
        <p>Starting Time: {trip.startingTime}</p>
        <p>Duration: {trip.duration}</p>
        <p>Adult Price: LKR {trip.adultPrice}</p>
        {trip.childPrice && <p>Child Price: LKR {trip.childPrice}</p>}

        <form className="booking-form" onSubmit={handleSubmit}>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Date of Safari:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />

          <label>Number of Adults:</label>
          <input type="number" name="adults" min="1" value={formData.adults} onChange={handleChange} required />

          <label>Number of Children:</label>
          <input type="number" name="children" min="0" value={formData.children} onChange={handleChange} />

          <label>Select Boat:</label>
          <select name="boatId" value={formData.boatId} onChange={handleChange} required>
            <option value="">-- Select Boat --</option>
            {boats.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.boatType}) | Price: LKR {b.price}
              </option>
            ))}
          </select>

          <label>Select Trip:</label>
          <select name="tripId" value={formData.tripId} onChange={handleChange} required>
            <option value="">-- Select Trip --</option>
            {trips.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.type}) | Adult: LKR {t.adultPrice}, Child: LKR {t.childPrice || 0}
              </option>
            ))}
          </select>

          <p>Total Price: LKR {totalPrice}</p>

          <h3>Payment Details</h3>
          <label>Card Number:</label>
          <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} required />

          <label>Expiry (MM/YY):</label>
          <input type="text" name="expiry" value={formData.expiry} onChange={handleChange} required />

          <label>CVV:</label>
          <input type="text" name="cvv" value={formData.cvv} onChange={handleChange} required />

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : `Pay LKR ${totalPrice}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Booking;
