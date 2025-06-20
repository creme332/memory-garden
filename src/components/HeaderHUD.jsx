import { useEffect, useState } from "react";
import { Emotions } from "../model/Emotion";

const HeaderHUD = ({ zoneName = "", viewMode = "character" }) => {
  const [showToast, setShowToast] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setShowToast(true);
    const timer = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(timer);
  }, [zoneName]);

  const emotionConfig = {
    [Emotions.HAPPY]: {
      color: "text-yellow-400",
      bg: "from-yellow-500/40 to-amber-500/30",
      glow: "shadow-yellow-500/40"
    },
    [Emotions.SAD]: {
      color: "text-blue-400",
      bg: "from-blue-500/40 to-cyan-500/30",
      glow: "shadow-blue-500/40"
    },
    [Emotions.NEUTRAL]: {
      color: "text-emerald-400",
      bg: "from-emerald-500/40 to-green-500/30",
      glow: "shadow-emerald-500/40"
    },
    [Emotions.ANGRY]: {
      color: "text-red-400",
      bg: "from-red-500/40 to-orange-500/30",
      glow: "shadow-red-500/40"
    }
  };

  const currentEmotion = emotionConfig[zoneName];

  const modeConfig = {
    character: { color: "#A855F7", bg: "from-purple-500/30 to-violet-600/20" },
    vr: { color: "#06B6D4", bg: "from-cyan-500/30 to-teal-600/20" },
    orbital: { color: "#F59E0B", bg: "from-amber-500/30 to-yellow-600/20" }
  };

  const currentMode = modeConfig[viewMode] || modeConfig["character"];

  const controls = [
    { keys: "WASD / ↑↓←→", action: "Move" },
    { keys: "Shift", action: "Sprint" },
    { keys: "Ctrl + F", action: "Add Memory" },
    { keys: "Ctrl + V", action: "Switch View" },
    { keys: "Click", action: "Inspect" },
    { keys: "Alt + Click", action: "Edit Memory" },
    { keys: "Ctrl + Click", action: "Delete Memory" }
  ];

  return (
    <>
      {/* Main HUD Panel */}
      <div className="fixed top-6 left-6 z-50 transition-all duration-300 ease-out w-80 group">
        {/* Glassmorphism Container */}
        <div
          className={`relative overflow-hidden rounded-2xl border border-white/20
          bg-gradient-to-br ${currentEmotion.bg} backdrop-blur-xl
          shadow-2xl ${currentEmotion.glow} transition-all duration-300`}
        >
          {/* Header Section */}
          <div className="relative p-4 pb-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 
                  flex items-center justify-center backdrop-blur-sm"
                >
                  <div
                    className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 
                    animate-pulse shadow-lg shadow-emerald-500/50"
                  ></div>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white tracking-wider">
                    Memory Garden
                  </h1>
                  <div className="w-full h-0.5 bg-gradient-to-r from-white/40 to-transparent mt-1"></div>
                </div>
              </div>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-6 h-6 rounded-lg bg-white/10 hover:bg-white/20 
                  flex items-center justify-center transition-all duration-200
                  border border-white/20 hover:border-white/30"
              >
                <div
                  className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                >
                  <svg
                    className="w-3 h-3 text-white/80"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
            </div>

            {isExpanded && (
              <>
                {/* Zone and Mode Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`text-base font-bold ${currentEmotion.color} tracking-wide`}
                    >
                      {zoneName || "Exploring..."}
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-xs font-bold tracking-wide"
                      style={{
                        backgroundColor: `${currentMode.color}30`,
                        color: currentMode.color,
                        border: `1px solid ${currentMode.color}40`
                      }}
                    >
                      {viewMode.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Controls Grid */}
                <div className="space-y-1">
                  <div className="text-xs font-medium text-white/70 uppercase tracking-wider mb-2">
                    Controls
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {controls.map((control, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-1"
                      >
                        <span
                          className="text-xs font-mono text-white/90 bg-white/10 px-2 py-0.5 
                          rounded border border-white/20 min-w-0 flex-shrink-0"
                        >
                          {control.keys}
                        </span>
                        <span className="text-xs text-white/70 ml-2 truncate">
                          {control.action}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Ambient glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Zone Change Toast */}
      {showToast && zoneName && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
          transition-all duration-700 ease-out animate-in fade-in slide-in-from-top-4"
        >
          <div
            className={`relative overflow-hidden rounded-2xl border border-white/30
            bg-gradient-to-br ${currentEmotion.bg} backdrop-blur-xl
            shadow-2xl ${currentEmotion.glow} px-8 py-6`}
          >
            <div className="text-center space-y-2">
              <div
                className={`text-2xl font-bold ${currentEmotion.color} tracking-wide`}
              >
                {zoneName}
              </div>
              <div className="text-sm text-white/80 font-medium">
                Zone Entered
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderHUD;
