import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import { useState } from "react";

function App() {
  const [showToast, setShowToast] = useState(false);
  return (
    <main>
      <Routes>
        <Route path="/" element={<Login showToast={showToast} setShowToast={setShowToast} />}></Route>
        <Route path="/register" element={<Register showToast={showToast} setShowToast={setShowToast} />}></Route>
      </Routes>
    </main>
  );
}

export default App;
