import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import Boards from "./pages/Boards";
import Board from "./pages/Board";
import Members from "./pages/Members";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { AiOutlineUser } from "react-icons/ai";

function App() {
  return (
    <main>
      <nav>
        <div className="nav-container navbar">
          <img className="logo" src="logo.png" alt="logo"></img>
          <div className="navbar-links">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/boards">Boards</Link>
              </li>
              <li>
                <Link to="/login">
                  Sign In
                  <AiOutlineUser className="nav-icon"> </AiOutlineUser>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/boards" element={<Boards />} />
        <Route path="/board/:id" element={<Board />} />
        <Route path="/board/members/:id" element={<Members />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default App;
