import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../Styles/AdminPanel.css";

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [boats, setBoats] = useState([]);
  const [trips, setTrips] = useState([]);
  const [activeTab, setActiveTab] = useState("bookings");
  const navigate = useNavigate();

  // --- Booking Form ---
  const [bookingForm, setBookingForm] = useState({
    id: null,
    name: "",
    email: "",
    safariDate: "",
    adults: "",
    children: "",
    totalPrice: "",
    boatId: "",
    tripId: "",
  });

  // --- Boat Form ---
  const [boatForm, setBoatForm] = useState({
    id: null,
    name: "",
    capacity: "",
    price: "",
    boatType: "Luxury",
  });
  const boatTypes = ["Luxury", "Standard", "Fishing", "Speed"];

  // --- Trip Form ---
  const [tripForm, setTripForm] = useState({
    id: null,
    name: "",
    type: "Shared",
    adultPrice: "",
    childPrice: "",
    description: "",
    startingTime: "",
    duration: "",
  });

  // --- Fetch Data ---
  const fetchDashboard = () => {
    axios
      .get("http://localhost:8080/api/admin/dashboard")
      .then((res) => {
        const data = res.data;
        setBookings(data.bookings || []);
        setUsers(data.users || []);
        setBoats(data.boats || []);
      })
      .catch((err) => console.error(err));
  };

  const fetchTrips = () => {
    axios
      .get("http://localhost:8080/api/trips")
      .then((res) => setTrips(res.data || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchDashboard();
    fetchTrips();
  }, []);

  // --- Booking Validation ---
  const validateBooking = (b) => {
    if (!b.name || b.name.trim().length < 3)
      return "Name must be at least 3 characters.";
    if (!b.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email))
      return "Invalid email address.";
    if (!b.safariDate) return "Safari Date is required.";
    if (!b.adults || isNaN(b.adults) || parseInt(b.adults) < 1)
      return "At least 1 adult is required.";
    if (isNaN(b.children) || parseInt(b.children) < 0)
      return "Children must be 0 or more.";
    if (!b.totalPrice || isNaN(b.totalPrice) || parseFloat(b.totalPrice) < 1)
      return "Total Price must be greater than 0.";
    if (!b.boatId) return "Please select a Boat.";
    if (!b.tripId) return "Please select a Trip.";
    return null;
  };

  // --- Booking Handlers ---
  const handleBookingChange = (e) =>
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });

  const handleSaveBooking = () => {
    const error = validateBooking(bookingForm);
    if (error) return alert(error);

    const payload = {
      ...bookingForm,
      adults: parseInt(bookingForm.adults),
      children: parseInt(bookingForm.children),
      totalPrice: parseFloat(bookingForm.totalPrice),
      boat: bookingForm.boatId ? { id: bookingForm.boatId } : null,
      trip: bookingForm.tripId ? { id: bookingForm.tripId } : null,
    };

    const apiCall = bookingForm.id
      ? axios.put(
          `http://localhost:8080/api/bookings/${bookingForm.id}`,
          payload
        )
      : axios.post("http://localhost:8080/api/bookings", payload);

    apiCall
      .then(() => {
        setBookingForm({
          id: null,
          name: "",
          email: "",
          safariDate: "",
          adults: "",
          children: "",
          totalPrice: "",
          boatId: "",
          tripId: "",
        });
        fetchDashboard();
      })
      .catch(console.error);
  };

  const handleEditBooking = (booking) =>
    setBookingForm({
      id: booking.id,
      name: booking.name,
      email: booking.email,
      safariDate: booking.safariDate || "",
      adults: booking.adults,
      children: booking.children,
      totalPrice: booking.totalPrice,
      boatId: booking.boat?.id || "",
      tripId: booking.trip?.id || "",
    });

  const handleDeleteBooking = (id) =>
    axios
      .delete(`http://localhost:8080/api/bookings/${id}`)
      .then(fetchDashboard)
      .catch(console.error);

  // --- Boat Validation ---
  const validateBoat = (b) => {
    if (!b.name || b.name.trim().length < 3)
      return "Boat name must be at least 3 characters.";
    if (!b.capacity || isNaN(b.capacity) || parseInt(b.capacity) < 1)
      return "Capacity must be at least 1.";
    if (!b.price || isNaN(b.price) || parseFloat(b.price) < 1)
      return "Price must be greater than 0.";
    return null;
  };

  // --- Boat Handlers ---
  const handleBoatChange = (e) =>
    setBoatForm({ ...boatForm, [e.target.name]: e.target.value });

  const handleSaveBoat = () => {
    const error = validateBoat(boatForm);
    if (error) return alert(error);

    const payload = {
      ...boatForm,
      capacity: parseInt(boatForm.capacity),
      price: parseFloat(boatForm.price),
    };

    const apiCall = boatForm.id
      ? axios.put(`http://localhost:8080/api/boats/${boatForm.id}`, payload)
      : axios.post("http://localhost:8080/api/boats", payload);

    apiCall
      .then(() => {
        setBoatForm({
          id: null,
          name: "",
          capacity: "",
          price: "",
          boatType: "Luxury",
        });
        fetchDashboard();
      })
      .catch(console.error);
  };

  const handleEditBoat = (boat) => setBoatForm(boat);
  const handleDeleteBoat = (id) =>
    axios
      .delete(`http://localhost:8080/api/boats/${id}`)
      .then(fetchDashboard)
      .catch(console.error);

  // --- Trip Validation ---
  const validateTrip = (trip) => {
    if (!trip.name || trip.name.trim().length < 3)
      return "Trip name must be at least 3 characters.";
    if (trip.name.length > 50) return "Trip name cannot exceed 50 characters.";
    if (
      !trip.adultPrice ||
      isNaN(trip.adultPrice) ||
      parseFloat(trip.adultPrice) <= 1
    )
      return "Adult Price must be greater than 1.";
    if (
      !trip.childPrice ||
      isNaN(trip.childPrice) ||
      parseFloat(trip.childPrice) <= 1
    )
      return "Child Price must be greater than 1.";
    if (!trip.startingTime || !/^\d{2}:\d{2}$/.test(trip.startingTime))
      return "Starting Time must be in HH:mm format.";
    if (
      !trip.duration ||
      !/^\d+(\.\d+)?\s*(hours?|hrs?|minutes?|mins?)$/i.test(trip.duration)
    )
      return "Duration must be valid (e.g., '2 hours', '90 minutes').";
    if (trip.description && trip.description.length > 250)
      return "Description cannot exceed 250 characters.";
    return null;
  };

  // --- Trip Handlers ---
  const handleTripChange = (e) =>
    setTripForm({ ...tripForm, [e.target.name]: e.target.value });

  const handleSaveTrip = () => {
    const errorMsg = validateTrip(tripForm);
    if (errorMsg) return alert(errorMsg);

    const payload = {
      ...tripForm,
      adultPrice: parseFloat(tripForm.adultPrice),
      childPrice: tripForm.childPrice ? parseFloat(tripForm.childPrice) : null,
    };

    const apiCall = tripForm.id
      ? axios.put(`http://localhost:8080/api/trips/${tripForm.id}`, payload)
      : axios.post("http://localhost:8080/api/trips", payload);

    apiCall
      .then(() => {
        setTripForm({
          id: null,
          name: "",
          type: "Shared",
          adultPrice: "",
          childPrice: "",
          startingTime: "",
          duration: "",
          description: "",
        });
        fetchTrips();
      })
      .catch(console.error);
  };

  const handleEditTrip = (trip) => setTripForm(trip);
  const handleDeleteTrip = (id) =>
    axios
      .delete(`http://localhost:8080/api/trips/${id}`)
      .then(fetchTrips)
      .catch(console.error);

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>
      <div className="admin-tabs">
        {["bookings", "users", "boats", "trips"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ✅ BOOKINGS */}
      {activeTab === "bookings" && (
        <section>
          <h2>Bookings</h2>
          {/* --- REPORT BUTTON --- */}
          <div className="report-action">
            <button
              className="generate-report-btn"
              onClick={() => {
                axios
                  .post("http://localhost:8080/api/reports/generate")
                  .then((res) => {
                    console.log("Report generated:", res.data);
                    navigate("/report"); // ✅ now works
                  })
                  .catch((err) => console.error(err));
              }}
            >
              Generate Report
            </button>
          </div>

          {/* Table */}
          {bookings.length === 0 ? (
            <p>No bookings</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Safari Date</th>
                  <th>Adults</th>
                  <th>Children</th>
                  <th>Total Price</th>
                  <th>Boat</th>
                  <th>Trip</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.name}</td>
                    <td>{b.email}</td>
                    <td>{b.safariDate}</td>
                    <td>{b.adults}</td>
                    <td>{b.children}</td>
                    <td>{b.totalPrice}</td>
                    <td>{b.boat?.name || "N/A"}</td>
                    <td>{b.trip?.name || "N/A"}</td>
                    <td>
                      <button onClick={() => handleEditBooking(b)}>Edit</button>
                      <button onClick={() => handleDeleteBooking(b.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Form */}
          <div className="booking-form">
            <h3>{bookingForm.id ? "Update Booking" : "Add Booking"}</h3>
            <input
              name="name"
              value={bookingForm.name}
              onChange={handleBookingChange}
              placeholder="Name"
              required
            />
            <input
              name="email"
              value={bookingForm.email}
              onChange={handleBookingChange}
              placeholder="Email"
              required
            />
            <input
              type="date"
              name="safariDate"
              value={bookingForm.safariDate}
              onChange={handleBookingChange}
              required
            />
            <input
              type="number"
              min="1"
              name="adults"
              value={bookingForm.adults}
              onChange={handleBookingChange}
              placeholder="Adults"
              required
            />
            <input
              type="number"
              min="0"
              name="children"
              value={bookingForm.children}
              onChange={handleBookingChange}
              placeholder="Children"
            />
            <input
              type="number"
              min="1"
              step="0.01"
              name="totalPrice"
              value={bookingForm.totalPrice}
              onChange={handleBookingChange}
              placeholder="Total Price"
              required
            />
            <select
              name="boatId"
              value={bookingForm.boatId}
              onChange={handleBookingChange}
              required
            >
              <option value="">Select Boat</option>
              {boats.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.boatType})
                </option>
              ))}
            </select>
            <select
              name="tripId"
              value={bookingForm.tripId}
              onChange={handleBookingChange}
              required
            >
              <option value="">Select Trip</option>
              {trips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.type})
                </option>
              ))}
            </select>
            <button onClick={handleSaveBooking}>
              {bookingForm.id ? "Update" : "Add"}
            </button>
          </div>
        </section>
      )}

      {/* ✅ USERS */}
      {activeTab === "users" && (
        <section>
          <h2>Users</h2>
          {users.length === 0 ? (
            <p>No users</p>
          ) : (
            <ul>
              {users.map((u) => (
                <li key={u.id}>
                  {u.name} | {u.email}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* ✅ BOATS */}
      {activeTab === "boats" && (
        <section>
          <h2>Boats</h2>
          <input
            name="name"
            value={boatForm.name}
            onChange={handleBoatChange}
            placeholder="Name"
            required
          />
          <input
            type="number"
            min="1"
            name="capacity"
            value={boatForm.capacity}
            onChange={handleBoatChange}
            placeholder="Capacity"
            required
          />
          <input
            type="number"
            min="1"
            name="price"
            value={boatForm.price}
            onChange={handleBoatChange}
            placeholder="Price"
            required
          />
          <select
            name="boatType"
            value={boatForm.boatType}
            onChange={handleBoatChange}
          >
            {boatTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button onClick={handleSaveBoat}>
            {boatForm.id ? "Update" : "Add"}
          </button>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Capacity</th>
                <th>Price</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {boats.map((b) => (
                <tr key={b.id}>
                  <td>{b.name}</td>
                  <td>{b.capacity}</td>
                  <td>{b.price}</td>
                  <td>{b.boatType}</td>
                  <td>
                    <button onClick={() => handleEditBoat(b)}>Edit</button>
                    <button onClick={() => handleDeleteBoat(b.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* ✅ TRIPS */}
      {activeTab === "trips" && (
        <section>
          <h2>Trips</h2>
          <div className="trip-form">
            <input
              name="name"
              value={tripForm.name}
              onChange={handleTripChange}
              placeholder="Trip Name"
              required
            />
            <select
              name="type"
              value={tripForm.type}
              onChange={handleTripChange}
            >
              {["Shared", "Private", "Cabin"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="2"
              step="0.01"
              name="adultPrice"
              value={tripForm.adultPrice}
              onChange={handleTripChange}
              placeholder="Adult Price"
              required
            />
            <input
              type="number"
              min="2"
              step="0.01"
              name="childPrice"
              value={tripForm.childPrice}
              onChange={handleTripChange}
              placeholder="Child Price"
              required
            />
            <input
              type="time"
              name="startingTime"
              value={tripForm.startingTime || ""}
              onChange={handleTripChange}
              required
            />
            <input
              type="text"
              name="duration"
              value={tripForm.duration || ""}
              onChange={handleTripChange}
              placeholder="Duration (e.g., 2 hours)"
              required
            />
            <textarea
              name="description"
              value={tripForm.description || ""}
              onChange={handleTripChange}
              placeholder="Description"
            />
            <button onClick={handleSaveTrip}>
              {tripForm.id ? "Update" : "Add"}
            </button>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Adult Price</th>
                <th>Child Price</th>
                <th>Starting Time</th>
                <th>Duration</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.length === 0 ? (
                <tr>
                  <td colSpan="9">No trips available</td>
                </tr>
              ) : (
                trips.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.name}</td>
                    <td>{t.type}</td>
                    <td>{t.adultPrice}</td>
                    <td>{t.childPrice || "N/A"}</td>
                    <td>{t.startingTime}</td>
                    <td>{t.duration}</td>
                    <td>{t.description}</td>
                    <td>
                      <button onClick={() => handleEditTrip(t)}>Edit</button>
                      <button onClick={() => handleDeleteTrip(t.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default AdminPanel;
