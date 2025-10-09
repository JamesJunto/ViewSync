import { socket } from "./connection"

socket.on("connection", (ws) => {
  console.log("A user connected");

  ws.on("message", (message) => {

    const data  = JSON.parse(message);
    console.log("Received message:", data);
    
})});