import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Send from "./pages/Send/Send";
import { useIntervalToGetLocation } from "./utils/location";

function InValidateURL() {
  return <Navigate to="/" />;
}

function App() {
  useIntervalToGetLocation();

  return (
    <Routes>
      <Route path="/" index element={<Home />} />
      <Route path="/send" element={<Send />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<InValidateURL />} />
    </Routes>
  );
}

export default App;
