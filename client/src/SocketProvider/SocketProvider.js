import React, { createContext } from "react";
import io from "socket.io-client";

export const socket = io.connect("https://caro-server.onrender.com");
export const SocketContext = createContext();
