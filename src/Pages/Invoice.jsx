import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import "../Styles/Invoice.css";

function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const invoiceRef = useRef();

  useEffect(() => {
    fetch(`http://localhost:8080/api/bookings/${id}`)
      .then((res) => res.json())
      .then((data) => setBooking(data))
      .catch((err) => console.error("Error fetching booking:", err));
  }, [id]);

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice_Booking_${id}`,
    onAfterPrint: () => alert("Invoice downloaded successfully!"),
  });

  if (!booking) {
    return <p style={{ textAlign: "center" }}>Loading booking details...</p>;
  }

  return (
    <div className="invoice-container">
      <div className="invoice-box" ref={invoiceRef}>
        <h1>Boat Safari Invoice</h1>
        <p>
          <strong>Invoice ID:</strong> {booking.id}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(booking.safariDate).toLocaleDateString()}
        </p>
        <hr />

        <h2>Customer Details</h2>
        <p>
          <strong>Name:</strong> {booking.name}
        </p>
        <p>
          <strong>Email:</strong> {booking.email}
        </p>

        <h2>Booking Details</h2>
        <p>
          <strong>Boat:</strong> {booking.boat?.name || "N/A"}
        </p>
        <p>
          <strong>Trip:</strong> {booking.trip?.name || "N/A"}
        </p>
        <p>
          <strong>Adults:</strong> {booking.adults}
        </p>
        <p>
          <strong>Children:</strong> {booking.children}
        </p>
        <p>
          <strong>Total Price:</strong> LKR {booking.totalPrice.toFixed(2)}
        </p>

        <hr />
        <p className="invoice-footer">
          Thank you for booking with Boat Safari!
        </p>
      </div>

      <div className="invoice-actions">
        <button className="download-btn" onClick={handlePrint}>
          Download / Print Invoice
        </button>
        <button className="close-btn" onClick={() => navigate("/booktrip")}>
          Close
        </button>
      </div>
    </div>
  );
}

export default Invoice;
