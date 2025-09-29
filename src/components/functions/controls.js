import { peerConnection } from "./connection";

let stream;
export const startScreenShare = async (videoRef) => {
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));
    return stream;
  } catch (err) {
    console.error("Error sharing screen:", err);
    alert("Error sharing screen: " + err);
  }
};

export const stopScreenShare = (videoRef) => {
  if (videoRef.current && videoRef.current.srcObject) {
    videoRef.current.srcObject = null;
    stream.getTracks().forEach((track) => track.stop());
  }
};
