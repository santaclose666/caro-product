import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import Login from "./pages/Login/Login";
import Game from "./pages/Game/Game";
import Register from "./pages/Register/Register";
import Lobby from "./pages/Lobby/Lobby";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/lobby" element={<Lobby/>}></Route>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}></Route>
      <Route path="/game/:type/:roomname" element={<Game/>}/>
      
    </Routes>
  );
}

export default App;
