import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import { useContext, useState } from "react";
import { UserContext } from "./Context/UserContext";
import EventsProvider from "./Components/EventsProvider/EventsProvider";
import SingleEvent from "./Components/SingleEvent/SingleEvent";

function App() {
  const [showToast, setShowToast] = useState(false);
  const { loggedInUser } = useContext(UserContext);
  return (
    <main>
      <Routes>
        <Route
          path="/"
          element={loggedInUser.email ? <Navigate to="/events" /> : <Login showToast={showToast} setShowToast={setShowToast} />}
        ></Route>
        <Route path="/register" element={loggedInUser.email ? <Navigate to="/events" /> : <Register setShowToast={setShowToast} />}></Route>
        <Route path="/events" element={loggedInUser.email ? <EventsProvider /> : <Navigate to="/" />} />
        <Route path="/events/:event_id" element={loggedInUser.email ? <SingleEvent /> : <Navigate to="/" />} />
      </Routes>
    </main>
  );
}

export default App;
