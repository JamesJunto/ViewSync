const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const peerConnection = new RTCPeerConnection(configuration);

const socket = new WebSocket("ws://localhost:8080");

socket.onmessage = async (event) => {
  const data = JSON.parse(event.data);

  if (data.offer) {
    console.log("Received offer:", data.offer);
    await peerConnection.setRemoteDescription(data.offer);

    const answerCon = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answerCon);

    socket.send(JSON.stringify({ answer: answerCon }));
  }

  if (data.answer) {
    await peerConnection.setRemoteDescription(data.answer);
    console.log("Received answer:", data.answer);
  }

};

export const makeOffer = async () => {
  const offerCon = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offerCon);

  socket.send(JSON.stringify({ offer: offerCon }));
  console.log("Offer sent to server", offerCon);
};

