import { useState, useRef } from "react";
import { startScreenShare, stopScreenShare} from "./controls.js";
import { makeOffer } from "../backend/connection.js";

const useScreenShare = () => {
  const localVideoRef = useRef(null);
  const [isSharing, setIsSharing] = useState(false);
  const [volume, setVolume] = useState(0);

  const handleStart = async () => {
    await startScreenShare(localVideoRef);
    makeOffer();
    setIsSharing(true);
  };

  const handleStop = () => {
    stopScreenShare(localVideoRef);
    setVolume(0);
    setIsSharing(false);
  };

  const handleVolumeChange = (e) => {
    const volumeValue = e.target.value;
    if (localVideoRef.current) {
      localVideoRef.current.volume = volumeValue / 100;
    }
    setVolume(volumeValue);
  };

  return {localVideoRef,isSharing,volume,handleStart,handleStop,handleVolumeChange}
  
};

export default useScreenShare;
