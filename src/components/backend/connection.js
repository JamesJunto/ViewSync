const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const socket = new WebSocket('ws://localhost:8080');
export const peerConnection = new RTCPeerConnection(configuration);

export const makeOffer = async () => {
  try {
    
    // Listen for messages from the server
    socket.addEventListener("message", async (event) => {
      const data = JSON.parse(event.data);

      // If we received an answer from the other peer
      if (data.answer) {
        await peerConnection.setRemoteDescription(data.answer);
      }
    });

    // Create an offer and set it as our local description
    const offerCon = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offerCon);

    console.log("Created offer:", offerCon);

    // Send the offer to the signaling server
    socket.send(JSON.stringify({ offer: offerCon }));

  } catch (err) {
    console.error("Error making call:", err);
  }
};

export const answerCall = async () => {
  try {
    // Listen for messages from the server
    socket.addEventListener("message", async (event) => {
      const data = JSON.parse(event.data);

      // If we received an offer from another peer
      if (data.offer) {
        await peerConnection.setRemoteDescription(data.offer);

        // Create an answer and set it as our local description
        const answerCon = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answerCon);

        // Send the answer back to the signaling server
        socket.send(JSON.stringify({ answer: answerCon }));
      }
    });
  } catch (err) {
    console.error("Error answering call:", err);
  }
  return {  makeOffer, answerCall };
};

