import { peerConnection, makeOffer, socket } from "../../backend/connection";

let stream;

export const startScreenShare = async (videoRef) => {
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });

      if (socket.readyState === WebSocket.OPEN) {
      await makeOffer();
      console.log("Offer sent to server");
    } else {
      socket.addEventListener('open', async () => {
        await makeOffer();
        console.log("Offer sent after connection opened");
      }, { once: true });
    }
 if (socket.readyState == WebSocket.OPEN) {
      await makeOffer();
      console.log("Client is connected to the server");
    }

    if (videoRef?.current) {
      videoRef.current.srcObject = stream;
    }

    return stream; 
  } catch (err) {
    console.error("Error sharing screen:", err);
  }
};

export const setupRemoteTrackListener = (remoteVideoRef) => {
  try {
    peerConnection.ontrack = (event) => {
      if (remoteVideoRef?.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };  

  } catch (err) {
    console.error("Error setting up remote track listener:", err);
  }
};

export const stopScreenShare = (videoRef) => {
  try {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    peerConnection.getSenders().forEach((sender) => {
      if (sender.track) {
        peerConnection.removeTrack(sender);
      }
    });

    if (videoRef?.current) {
      videoRef.current.srcObject = null;
    }

    socket.send(JSON.stringify({ type: "stop" }));

  } catch (err) {
    console.error("Error stopping screen share:", err);
  }
};
