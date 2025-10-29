import { useState,useRef } from "react";
export const socket = new WebSocket("ws://localhost:8080");

const useChat = () => {
  
const uniqIdRef = useRef(crypto.randomUUID());
const uniqId = uniqIdRef.current;

  const [chat, setChat] = useState([]);

  socket.onmessage = async (event) => {
    try {
      let data = event.data;

      if (data instanceof Blob) {
        data = await data.text();
      }

      data = JSON.parse(data);

          setChat((prevChat) => [
        ...prevChat,
        { text: data.text, sender: data.sender },
      ]);
    
      console.log("Received chat message:", data.text);

    } catch (error) {
      console.error("WebSocket message processing error:", error);
    }
  };

  const sendMessage = (message) => {
    try {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({ type: "chat", sender: uniqId, text: message })
        );
        console.log("Sent chat message:", message)
      }
    } catch (error) {
      console.error("WebSocket send error:", error);
    }
  };
  return { chat, setChat, uniqId, sendMessage };
};

export default useChat;
