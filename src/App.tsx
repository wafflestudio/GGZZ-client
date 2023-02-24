import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Receive from "./pages/Receive/Receive";
import Send from "./pages/Send/Send";

function App() {
  return (
    <Routes>
      <Route path="/send" element={<Send />} />
      <Route path="/receive" element={<Receive />} />
      <Route path="/" element={<Home />} index />
    </Routes>
  );
}

export default App;
