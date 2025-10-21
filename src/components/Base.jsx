import useScreenShare from "./functions/useScreenShare.js";
import { setupRemoteTrackListener } from "./functions/controls.js";
import { useState, useEffect } from "react";

const Base = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [muted, setIsMuted] = useState(false);

  const {
    localVideoRef,
    isSharing,
    volume,
    handleStart,
    handleStop,
    handleVolumeChange,
    remoteVideoRef,
} = useScreenShare();

  useEffect(() => {
    setupRemoteTrackListener(remoteVideoRef);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-teal-400 mb-6">ViewSync🎬</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={handleStart}
          className="bg-teal-400 hover:bg-teal-500 text-black px-4 py-2 rounded-xl shadow-md transition"
        >
          Start Sharing
        </button>

        <button
          onClick={handleStop}
          className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow-md transition`}
        >
          Stop Sharing
        </button>
      </div>

      <div className="w-full max-w-3xl flex flex-col items-center">
        <video
          id="localVideo"
          ref={localVideoRef}
          autoPlay
          playsInline
          className="w-full rounded-2xl border-2 border-teal-400 shadow-lg"
        ></video>

        <video
          id="remoteVideo"
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full rounded-2xl border-2 border-teal-400 shadow-lg"
        ></video>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => {
              if (isPaused) {
                localVideoRef.current?.play();
              } else {
                localVideoRef.current?.pause();
              }
              setIsPaused(!isPaused);
            }}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-xl shadow-md transition"
          >
            {isPaused ? "Resume" : "Pause"}
          </button>

          <button
            onClick={() => {
              if (muted) {
                localVideoRef.current.muted = false;
              } else {
                localVideoRef.current.muted = true;
              }
              setIsMuted(!muted);
            }}
            className="bg-purple-400 hover:bg-purple-500 text-white px-4 py-2 rounded-xl shadow-md transition"
          >
            {muted ? "Unmute" : "Mute"}
          </button>
        </div>

        <div className="flex flex-col items-center mt-4 w-full max-w-3xl">
          <p className="text-gray-300 mb-2">Volume 🔊</p>

          <div className="flex items-center w-full gap-4">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-2 bg-gray-700 rounded-lg accent-teal-400"
            />
            <span className="text-gray-300 w-12 text-right">{volume}</span>
          </div>
        </div>

        {isSharing ? (
          <p className="mt-4 text-teal-300">You are sharing your screen...</p>
        ) : (
          <p className="mt-4 text-gray-400">No active screen share</p>
        )}
      </div>
    </div>
  );
};

export default Base;
