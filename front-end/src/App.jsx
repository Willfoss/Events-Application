import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import { useContext, useState } from "react";
import { UserContext } from "./Context/UserContext";
import EventsProvider from "./Components/EventsProvider/EventsProvider";
import SingleEvent from "./Components/SingleEvent/SingleEvent";
import MyEvents from "./Components/MyEvents/MyEvents";
import Profile from "./Components/Profile/Profile";
import CreateEvent from "./Components/CreateEvent/CreateEvent";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";

function App() {
  const [showToast, setShowToast] = useState(false);
  const { loggedInUser } = useContext(UserContext);
  return (
    <main>
      <Routes>
        <Route path="/" element={loggedInUser ? <Navigate to="/events" /> : <Login showToast={showToast} setShowToast={setShowToast} />}></Route>
        <Route path="/register" element={loggedInUser ? <Navigate to="/events" /> : <Register setShowToast={setShowToast} />}></Route>
        <Route path="/events" element={loggedInUser ? <EventsProvider /> : <Navigate to="/" />} />
        <Route path="/events/:event_id" element={loggedInUser ? <SingleEvent /> : <Navigate to="/" />} />
        <Route path="/my-events" element={loggedInUser ? <MyEvents /> : <Navigate to="/" />} />
        <Route path="/my-profile" element={loggedInUser ? <Profile /> : <Navigate to="/" />} />
        <Route path="/create-event" element={loggedInUser ? <CreateEvent /> : <Navigate to="/" />} />
        <Route path="/admin-dashboard" element={loggedInUser ? <AdminDashboard /> : <Navigate to="/" />} />
      </Routes>
    </main>
  );
}

export default App;
