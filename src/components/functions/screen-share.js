let stream;

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const peerConnection = new RTCPeerConnection(configuration);
const remoteDesc = new RTCSessionDescription();

const makeOffer = async () => {
  try {
    signalingChannel.addEventListener("message", async (message) => {
      if (message.answer) {
        remoteDesc(message.answer);
        await peerConnection.setRemoteDescription(remoteDesc);
      }
    });
    const offerCon = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offerCon);
    console.log(offerCon)
    signalingChannel.send({ offer: offerCon });
  } catch (err) {
    console.error("Error making call: ", err);
  }
};

makeOffer();

const answerCall = async () => {
  try {
    signalingChannel.addEventListener("message", async (message) => {
      if (message.offer) {
        remoteDesc(message.offer);
        await peerConnection.setRemoteDescription(remoteDesc);
        const answerCon = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answerCon);
        signalingChannel.send({ answer: answerCon });
      }
    });
  } catch (err) {
    console.error(err);
  }
};


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
