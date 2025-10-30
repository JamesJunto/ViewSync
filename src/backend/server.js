import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {

  ws.on("message", (message) => {
    let data = JSON.parse(message);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        if (client !== ws) {
          client.send(message);
        } else if (data.type === "chat") {
          client.send(message);
        }
      }
    });
  });
});

wss.onerror = (error) => console.error("WebSocket error:", error);
