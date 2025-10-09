const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const socket = new WebSocket("ws://localhost:8080");
export const peerConnection = new RTCPeerConnection(configuration);

socket.onopen = () => {
  console.log("Connected to signaling server");
};

const makeOffer = async () => {
  try {
    socket.addEventListener("message", async (message) => {
      if (message.answer) {
        await peerConnection.setRemoteDescription(message.answer);
      }
    });

    const offerCon = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offerCon);
    console.log(offerCon);
    socket.send(JSON.stringify({ offer: offerCon }));

  } catch (err) {
    console.error("Error making call: ", err);
  }
};

const answerCall = async () => {
  try {
    socket.addEventListener("message", async (message) => {
      if (message.offer) {
        await peerConnection.setRemoteDescription(message.offer);
        const answerCon = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answerCon);
        socket.send(JSON.stringify({ offer: answerCon }));
      }
    });
  } catch (err) {
    console.error(err);
  }
};

