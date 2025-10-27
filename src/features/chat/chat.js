import { useState } from "react";
export const socket = new WebSocket("ws://localhost:8080");

 const useChat = () => {
  const [chat, setChat] = useState([]);

  socket.onmessage = async (event) => {
    try {
      let data = event.data;

      if (data instanceof Blob) {
        data = await data.text();
      }

      data = JSON.parse(data);

      if (data.type === "chat") {
        setChat((prevChat) => [...prevChat,  { text: data.text, sender: data.sender }]);
      }
     
    } catch (error) {
      console.error("WebSocket message processing error:", error);
    }
  }; 

  return { chat, setChat };
};

export const sendMessage = (message) => {
  try {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({ type: "chat", sender: "me", text: message })
      );
    }
  } catch (error) {
    console.error("WebSocket send error:", error);
  }
};

export default useChat;