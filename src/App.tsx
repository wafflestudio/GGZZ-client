import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Receive from "./pages/Receive/Receive";
import Register from "./pages/Register";
import Send from "./pages/Send/Send";
import { useIntervalToGetLocation } from "./lib/hooks/locationHooks";

function InValidateURL() {
  return <Navigate to="/" />;
}

function App() {
  useIntervalToGetLocation();

  return (
    <Routes>
      <Route path="/" index element={<Home />} />
      <Route path="/send" element={<Send />} />
      <Route path="/receive" element={<Receive />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<InValidateURL />} />
    </Routes>
  );
}

export default App;
