import { useState, useEffect } from "react";
import { setupRemoteTrackListener } from "./controls.js";
import useScreenShare from "./useScreenShare.js";
import { connectionMonitoring } from "./monitoring/connectionMonitor.js";
import LinkModal from "../components/linkModal.jsx";

import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Monitor,
  MonitorOff,
} from "lucide-react";

const Base = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [muted, setIsMuted] = useState(false);
  const [ready, setReady] = useState(false);
  const [showModal, setShowModal] = useState(false); // 🔹 controls modal visibility

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
    if (remoteVideoRef?.current) {
      setupRemoteTrackListener(remoteVideoRef);
    }
  }, [remoteVideoRef]);

  useEffect(() => {
    connectionMonitoring(setReady);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-teal-400 to-cyan-500 p-3 rounded-2xl shadow-lg">
              <Monitor className="w-6 h-6 text-slate-900" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              ViewSync
            </h1>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700">
            <div
              className={`w-2 h-2 rounded-full ${
                isSharing ? "bg-green-400 animate-pulse" : "bg-gray-500"
              }`}
            />
            <span className="text-sm text-gray-300">
              {isSharing ? "Streaming" : "Offline"}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => {
              handleStart();
              setShowModal(true); // 🔹 show modal after starting share
            }}
            disabled={isSharing}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <Monitor className="w-5 h-5" />
            Start Sharing
          </button>
          

          <button
            onClick={handleStop}
            disabled={!isSharing}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <MonitorOff className="w-5 h-5" />
            Stop Sharing
          </button>
        </div>

        {/* Your Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-300">
                Your Screen
              </h2>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                className="relative w-full aspect-video rounded-2xl border-2 border-slate-700 shadow-2xl bg-slate-800/50 backdrop-blur object-cover"
              />
              {!isSharing && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 backdrop-blur-sm rounded-2xl">
                  <div className="text-center">
                    <Monitor className="w-16 h-16 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No screen share active</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Media Controls */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">
            Media Controls
          </h3>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                if (isPaused) {
                  localVideoRef.current?.play();
                } else {
                  localVideoRef.current?.pause();
                }
                setIsPaused(!isPaused);
              }}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-medium px-5 py-3 rounded-xl shadow-md transition-all duration-200 hover:scale-105"
            >
              {isPaused ? (
                <>
                  <Play className="w-5 h-5" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              )}
            </button>

            <button
              onClick={() => {
                if (localVideoRef.current) {
                  localVideoRef.current.muted = !muted;
                }
                setIsMuted(!muted);
              }}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-medium px-5 py-3 rounded-xl shadow-md transition-all duration-200 hover:scale-105"
            >
              {muted ? (
                <>
                  <VolumeX className="w-5 h-5" />
                  Unmute
                </>
              ) : (
                <>
                  <Volume2 className="w-5 h-5" />
                  Mute
                </>
              )}
            </button>

            <div className="flex-1 min-w-64 flex items-center gap-4 bg-slate-700/50 px-5 py-3 rounded-xl">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-teal-400"
                style={{
                  background: `linear-gradient(to right, rgb(45, 212, 191) 0%, rgb(45, 212, 191) ${volume}%, rgb(71, 85, 105) ${volume}%, rgb(71, 85, 105) 100%)`,
                }}
              />
              <span className="text-sm font-medium text-gray-300 w-12 text-right">
                {volume}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {showModal && <LinkModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Base;
