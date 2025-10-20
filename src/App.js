import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import AdminPanel from "./Pages/AdminPanel";
import Booking from "./Pages/Booking";
import Login from "./Pages/Login";
import Registration from "./Pages/Registration";
import Feedback from "./Pages/Feedback";
import Booktrip from "./Pages/Booktrip"; // ✅ Correct spelling
import Report from "./Pages/Report"; // ✅ Report page
import Invoice from "./Pages/Invoice";
import UserManagement from "./Pages/UserManagement";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/booking" element={<Booking />} />
  <Route path="/booktrip" element={<Booktrip />} />
  <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
  <Route path="/register" element={<Registration />} />
  <Route path="/admin" element={<AdminPanel />} />
  <Route path="/feedback" element={<Feedback />} />
  <Route path="/report" element={<Report />} />
  <Route path="/invoice/:id" element={<Invoice />} /> {/* ✅ Invoice route */}
  <Route path="/usermanagement" element={<UserManagement />} />

</Routes>

    </BrowserRouter>
  );
}

export default App;
