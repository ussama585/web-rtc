import { create } from "zustand";
import { io } from "socket.io-client";

const socket = io("ws://127.0.0.1:8000/ws/video", []);

const socketStore = create((set) => ({
  socket: socket,
}));

export default socketStore;
