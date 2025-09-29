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
    console.log(offerCon);
    signalingChannel.send({ offer: offerCon });
  } catch (err) {
    console.error("Error making call: ", err);
  }
};

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
