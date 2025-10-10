import WebSocket from "ws";

const wss = new WebSocket.Server({ port: 8080 });

  wss.on("connection", (ws) => {
    console.log("A user connected");

    ws.on("message", (message) => {
     wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });
  });

wss.onerror = (error) => console.error("WebSocket error:", error);
  
