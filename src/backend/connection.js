import { remoteVideoRef } from "../features/screenshare/useScreenShare";

const configuration = {
  iceServers: [
    {
      urls:['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
    }
    ],
};

export const peerConnection = new RTCPeerConnection(configuration);
export const socket = new WebSocket("ws://localhost:8080");

let pendingCandidates = [];

peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    socket.send(
      JSON.stringify({
        type: "candidate-sh",
        candidate: event.candidate,
      })
    );
  }
};

socket.onmessage = async (event) => {
  let data = event.data;

  if (data instanceof Blob) data = await data.text();
  data = JSON.parse(data);

  switch (data.type) {
    case "offer":
      await handleOffer(data.offer);
      break;

    case "answer":
      if (peerConnection.signalingState === "have-local-offer") {
        console.log("Received answer:", data.answer);
        await peerConnection.setRemoteDescription(data.answer);
      }
      break;

    case "candidate":
      if (peerConnection.remoteDescription) {
        await peerConnection.addIceCandidate(data.candidate);
      } else {
        pendingCandidates.push(data.candidate);
      }
      break;

    case "stop":
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      break;
  }
};

const handleOffer = async (offer) => {
  await peerConnection.setRemoteDescription(offer);
  console.log("Received offer:", offer);

  for (let candidate of pendingCandidates) {
    await peerConnection.addIceCandidate(candidate);
  }
  pendingCandidates = [];

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  sendWhenReady({
    type: "answer",
    answer: {
      type: answer.type,
      sdp: answer.sdp,
    },
  });

console.log("Answer sent to server", answer);
};

export const makeOffer = async () => {
  try {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    sendWhenReady({
      type: "offer",
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
    });

    console.log("Offer sent to server", offer);
  } catch (err) {
    console.error("Error creating offer:", err);
  }
};

const sendWhenReady = (message) => {
  const sendMsg = () => socket.send(JSON.stringify(message));
  const buffAm = 1024;

  if (socket.bufferedAmount < buffAm) {
    console.log("Buff amount",socket.bufferedAmount)
    if (socket.readyState === WebSocket.OPEN) {
      sendMsg();
    } else {
      socket.onopen = sendMsg;
      console.log("Sending", message)
    }
  }

};
