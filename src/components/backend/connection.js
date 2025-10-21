const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const peerConnection = new RTCPeerConnection(configuration);

const socket = new WebSocket("ws://localhost:8080");

peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    socket.send(
      JSON.stringify({ type: "candidate", candidate: event.candidate })
    );
  }
};

let temp = [];

socket.onmessage = async (event) => {
  let data = event.data;

  if (data instanceof Blob) {
    data = await data.text();
  }
  data = JSON.parse(data);

  if (data.type === "offer") {
    await peerConnection.setRemoteDescription(data.offer);

    for (const c of temp) {
      await peerConnection.addIceCandidate(c);
    }
    temp = [];

    const answerCon = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answerCon);

    socket.send(
      JSON.stringify({
        type: "answer",
        answer: {
          type: answerCon.type,
          sdp: answerCon.sdp,
        },
      })
    );
    console.log("Answer sent to server",answerCon);
  }

  if (data.type === "candidate") {
    if (peerConnection.remoteDescription) {
      await peerConnection.addIceCandidate(data.candidate);
    } else {
      temp.push(data.candidate);
    }
  }

  if (data.type === "answer") {
    console.log("Received answer:", data.answer);
    await peerConnection.setRemoteDescription(data.answer);
  }
};

export const makeOffer = async () => {
  const offerCon = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offerCon);

  socket.send(
    JSON.stringify({
      type: "offer",
      offer: {
        type: offerCon.type,
        sdp: offerCon.sdp,
      },
    })
  );

  console.log("Offer sent to server", offerCon);
};
