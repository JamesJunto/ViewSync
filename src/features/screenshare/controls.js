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

export const stopScreenShare = (videoRef, remoteVideoRef) => {
  try {
    if (videoRef?.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
      peerConnection.getSenders().forEach((sender) => {
        if (sender.track && sender.track.kind === "video") {
          peerConnection.removeTrack(sender);
          console.log("Tracks removed")
        }
      });
      socket.send(JSON.stringify({ type: "stop" }));
    }

    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }

    if (remoteVideoRef?.current && remoteVideoRef.current.srcObject) {
      remoteVideoRef.current.srcObject = null;
    }

  } catch (err) {
    console.error("Error stopping screen share:", err);
  }
};
