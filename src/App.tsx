import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Receive from "./pages/Receive/Receive";
import Register from "./pages/Register";
import Send from "./pages/Send/Send";

function App() {
  return (
    <Routes>
      <Route path="/" index element={<Home />} />
      <Route path="/send" element={<Send />} />
      <Route path="/receive" element={<Receive />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
