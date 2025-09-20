import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/AdminPanel.css";

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [boats, setBoats] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingBoats, setLoadingBoats] = useState(true);
  const [loadingTimes, setLoadingTimes] = useState(true);

  // Boat form state
  const [boatForm, setBoatForm] = useState({ id: null, name: "", capacity: "", boatType: "Luxury" });
  const boatTypes = ["Luxury", "Standard", "Fishing", "Speed"];

  // Time slot form state
  const [timeForm, setTimeForm] = useState("");

  useEffect(() => {
    // Fetch bookings
    axios.get("http://localhost:8080/api/bookings")
      .then(res => setBookings(res.data))
      .catch(err => console.error("Error fetching bookings:", err))
      .finally(() => setLoadingBookings(false));

    // Fetch users
    axios.get("http://localhost:8080/api/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error fetching users:", err))
      .finally(() => setLoadingUsers(false));

    // Fetch boats
    axios.get("http://localhost:8080/api/boats")
      .then(res => setBoats(res.data))
      .catch(err => console.error("Error fetching boats:", err))
      .finally(() => setLoadingBoats(false));

    // Fetch time slots
    axios.get("http://localhost:8080/api/times")
      .then(res => setTimeSlots(res.data))
      .catch(err => console.error("Error fetching time slots:", err))
      .finally(() => setLoadingTimes(false));
  }, []);

  // Boat form handlers
  const handleBoatChange = (e) => setBoatForm({ ...boatForm, [e.target.name]: e.target.value });

  const handleSaveBoat = () => {
    if (!boatForm.name || !boatForm.capacity) return;

    if (boatForm.id) {
      axios.put(`http://localhost:8080/api/boats/${boatForm.id}`, boatForm)
        .then(() => {
          setBoats(boats.map(b => b.id === boatForm.id ? boatForm : b));
          setBoatForm({ id: null, name: "", capacity: "", boatType: "Luxury" });
        })
        .catch(err => console.error("Error updating boat:", err));
    } else {
      axios.post("http://localhost:8080/api/boats", boatForm)
        .then(res => {
          setBoats([...boats, res.data]);
          setBoatForm({ id: null, name: "", capacity: "", boatType: "Luxury" });
        })
        .catch(err => console.error("Error adding boat:", err));
    }
  };

  const handleEditBoat = (boat) => setBoatForm(boat);
  const handleDeleteBoat = (id) => {
    axios.delete(`http://localhost:8080/api/boats/${id}`)
      .then(() => setBoats(boats.filter(b => b.id !== id)))
      .catch(err => console.error("Error deleting boat:", err));
  };

  // Time slot handlers
  const handleAddTimeSlot = () => {
    if (!timeForm.trim()) return;
    axios.post("http://localhost:8080/api/times", { time: timeForm })
      .then(res => {
        setTimeSlots([...timeSlots, res.data]);
        setTimeForm("");
      })
      .catch(err => console.error("Error adding time slot:", err));
  };

  const handleDeleteTimeSlot = (id) => {
    axios.delete(`http://localhost:8080/api/times/${id}`)
      .then(() => setTimeSlots(timeSlots.filter(t => t.id !== id)))
      .catch(err => console.error("Error deleting time slot:", err));
  };

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>

      {/* Bookings Table */}
      <section>
        <h2>Bookings</h2>
        {loadingBookings ? <p>Loading bookings...</p> :
          bookings.length === 0 ? <p>No bookings found</p> :
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Email</th><th>Date</th><th>Passengers</th><th>Boat</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.name}</td>
                  <td>{b.email}</td>
                  <td>{new Date(b.safariDate).toLocaleDateString()}</td> {/* Format date */}
                  <td>{b.passengers}</td>
                  <td>{b.boatType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </section>

      {/* Users Table */}
      <section>
        <h2>Registered Users</h2>
        {loadingUsers ? <p>Loading users...</p> :
          users.length === 0 ? <p>No users found</p> :
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </section>

      {/* Boats Management */}
      <section>
        <h2>Manage Boats</h2>
        <div className="boat-form">
          <input type="text" name="name" placeholder="Boat Name" value={boatForm.name} onChange={handleBoatChange} />
          <input type="number" name="capacity" placeholder="Capacity" value={boatForm.capacity} onChange={handleBoatChange} />
          <select name="boatType" value={boatForm.boatType} onChange={handleBoatChange}>
            {boatTypes.map((type, idx) => <option key={idx} value={type}>{type}</option>)}
          </select>
          <button onClick={handleSaveBoat}>{boatForm.id ? "Update Boat" : "Add Boat"}</button>
        </div>

        {loadingBoats ? <p>Loading boats...</p> :
          boats.length === 0 ? <p>No boats available</p> :
          <ul>
            {boats.map(b => (
              <li key={b.id}>
                {b.name} | Capacity: {b.capacity} | Type: {b.boatType}
                <button onClick={() => handleEditBoat(b)}>Edit</button>
                <button onClick={() => handleDeleteBoat(b.id)}>Delete</button>
              </li>
            ))}
          </ul>
        }
      </section>

      {/* Time Slots Management */}
      <section>
        <h2>Manage Time Slots</h2>
        <div className="time-form">
          <input type="text" placeholder="e.g. 08:00 AM" value={timeForm} onChange={(e) => setTimeForm(e.target.value)} />
          <button onClick={handleAddTimeSlot}>Add Time Slot</button>
        </div>

        {loadingTimes ? <p>Loading time slots...</p> :
          timeSlots.length === 0 ? <p>No time slots available</p> :
          <ul>
            {timeSlots.map(t => (
              <li key={t.id}>
                {t.time}
                <button onClick={() => handleDeleteTimeSlot(t.id)}>Delete</button>
              </li>
            ))}
          </ul>
        }
      </section>
    </div>
  );
};

export default AdminPanel;
