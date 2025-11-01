import { useState,useEffect } from "react";
import useScreenShare from "../screenshare/useScreenShare.js";
import { connectionMonitoring } from "../screenshare/monitoring/connectionMonitor.js";
import { useParams } from "react-router-dom";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Monitor,
  MonitorOff,
} from "lucide-react";

const RemotePeer = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [muted, setIsMuted] = useState(false);
  const [ready, setReady] = useState(false);

  const { id } = useParams();
  console.log("RemotePeer ID:", id); 

  console.log("Viewing screen share with ID:", id);
   useEffect(() => {
    connectionMonitoring(setReady);
  }, []);

  

  const { volume, handleStop, handleVolumeChange, remoteVideoRef } = useScreenShare();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-10">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ViewSync
          </h1>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="relative w-full aspect-video rounded-2xl border-2 border-slate-700 shadow-2xl bg-slate-800/50 backdrop-blur object-cover"
            />
            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 backdrop-blur-sm rounded-2xl">
                <div className="text-center">
                  <Monitor className="w-16 h-16 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Waiting for screen share...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">
            Viewer Controls
          </h3>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => {
                if (isPaused) {
                  remoteVideoRef.current?.play();
                } else {
                  remoteVideoRef.current?.pause();
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
                if (remoteVideoRef.current) {
                  remoteVideoRef.current.muted = !muted;
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

            {/* Stop Share */}
            <button
              onClick={handleStop}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-medium px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <MonitorOff className="w-5 h-5" />
              Stop Share
            </button>

            <div className="flex-1 min-w-64 flex items-center gap-4 bg-slate-700/50 px-5 py-3 rounded-xl">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-pink-400"
                style={{
                  background: `linear-gradient(to right, rgb(236, 72, 153) 0%, rgb(236, 72, 153) ${volume}%, rgb(71, 85, 105) ${volume}%, rgb(71, 85, 105) 100%)`,
                }}
              />
              <span className="text-sm font-medium text-gray-300 w-12 text-right">
                {volume}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RemotePeer;
