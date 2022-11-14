import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import Boards from "./pages/Boards";
import Board from "./pages/Board";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <main>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/boards">Boards</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/boards" element={<Boards />} />
        <Route path="/board/:id" element={<Board />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default App;
