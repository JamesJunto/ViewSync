import { peerConnection } from "../../../backend/connection";

export const connectionMonitoring = (setReady) => {
  let gatheringComplete = false;
  let connectionGood = false;

  const updateReady = () => {
    const ready = connectionGood && gatheringComplete;
    setReady(ready);
  };

  peerConnection.oniceconnectionstatechange = () => {
    const state = peerConnection.iceConnectionState;
    console.log("ICE connection state:", state);
    connectionGood = state === "connected" || state === "completed";
    updateReady();
  };

  peerConnection.onicegatheringstatechange = () => {
    const state = peerConnection.iceGatheringState;
    console.log("ICE gathering:", state);
    gatheringComplete = state === "complete";
    updateReady();
  };
};
