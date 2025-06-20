import { useState } from "react";
import { Emotions } from "../model/Emotion";
/**
 * A horizontal timeline component that can be toggled on/off.
 * @param {Object} props
 * @param {Array} props.entries - Array of journal entries with emotion data
 * @returns {JSX.Element}
 */
export default function Timeline({ entries = [] }) {
  // Sort entries by date in descending order (most recent first)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedEntries, setExpandedEntries] = useState(new Set());

  // Emotion configuration
  const emotionConfig = {
    [Emotions.HAPPY]: {
      color: "text-yellow-400",
      bg: "from-yellow-500/40 to-amber-500/30",
      glow: "shadow-yellow-500/40",
      dotBg: "from-yellow-400 to-amber-500",
      borderColor: "border-yellow-500/30"
    },
    [Emotions.SAD]: {
      color: "text-blue-400",
      bg: "from-blue-500/40 to-cyan-500/30",
      glow: "shadow-blue-500/40",
      dotBg: "from-blue-400 to-cyan-500",
      borderColor: "border-blue-500/30"
    },
    [Emotions.NEUTRAL]: {
      color: "text-emerald-400",
      bg: "from-emerald-500/40 to-green-500/30",
      glow: "shadow-emerald-500/40",
      dotBg: "from-emerald-400 to-green-500",
      borderColor: "border-emerald-500/30"
    },
    [Emotions.ANGRY]: {
      color: "text-red-400",
      bg: "from-red-500/40 to-orange-500/30",
      glow: "shadow-red-500/40",
      dotBg: "from-red-400 to-orange-500",
      borderColor: "border-red-500/30"
    }
  };

  const toggleEntryExpansion = (entryId) => {
    setExpandedEntries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  return (
    <div
      className={`fixed right-0 top-0 h-full bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-gray-900/95 backdrop-blur-md border-l border-cyan-500/30 shadow-2xl transform transition-all duration-500 ease-out ${
        isExpanded ? "w-80" : "w-16"
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-2 rounded-l-lg shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 group z-10"
      >
        <svg
          className={`w-4 h-4 transform transition-transform duration-500 ease-out ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Header */}
      <div
        className={`p-6 border-b border-cyan-500/30 ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"} transition-all duration-300`}
      >
        <h2 className="text-xl font-semibold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
          Timeline
        </h2>
        <p className="text-sm text-gray-400 mt-1">Track your journey</p>
      </div>

      {/* Timeline content */}
      <div className="overflow-y-auto  h-full pb-20 custom-scrollbar-hide scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-transparent">
        <div className="relative px-6 py-8">
          {/* Timeline line */}
          <div
            className={`absolute ${isExpanded ? "left-8" : "left-1/2 -translate-x-1/2"} top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/80 via-blue-400/60 to-transparent`}
          />

          {sortedEntries.map((entry, index) => {
            const emotion =
              emotionConfig[entry.emotion] || emotionConfig.NEUTRAL;
            const isEntryExpanded = expandedEntries.has(entry.id);

            return (
              <div
                key={entry.id}
                className="relative mb-8 last:mb-0 group"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Timeline dot with emotion-based colors */}
                {isExpanded && (
                  <div className="absolute left-8 -translate-x-1/2 flex items-center justify-center">
                    <div
                      className={`w-4 h-4 bg-gradient-to-br ${emotion.dotBg} rounded-full shadow-lg border-2 border-slate-700 relative ${emotion.glow}`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${emotion.dotBg} rounded-full animate-ping opacity-30`}
                      />
                    </div>
                  </div>
                )}

                {/* Entry content */}
                <div
                  className={`ml-8 bg-gradient-to-br ${emotion.bg} backdrop-blur-sm p-5 rounded-2xl shadow-lg border ${emotion.borderColor} hover:shadow-xl transition-all duration-300 group-hover:transform group-hover:-translate-y-1 ${emotion.glow} ${
                    isExpanded
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-8 pointer-events-none"
                  }`}
                  style={{
                    transitionDelay: isExpanded ? `${index * 50}ms` : "0ms"
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`text-xs font-medium ${emotion.color} bg-slate-700/80 px-3 py-1 rounded-full border ${emotion.borderColor}`}
                    >
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric"
                      })}
                    </div>
                    {entry.emotion && entry.emotion !== "NEUTRAL" && (
                      <div
                        className={`text-xs ${emotion.color} bg-slate-800/60 px-2 py-1 rounded-full border ${emotion.borderColor}`}
                      >
                        {entry.emotion}
                      </div>
                    )}
                  </div>
                  <h3
                    className={`text-base font-semibold ${emotion.color} leading-snug transition-colors duration-200`}
                  >
                    {entry.title}
                  </h3>

                  {/* Description with expand/collapse */}
                  {entry.description && (
                    <div className="mt-3">
                      <p
                        className={`text-sm text-gray-300 leading-relaxed transition-all duration-300 ${
                          isEntryExpanded ? "" : "line-clamp-2"
                        }`}
                      >
                        {entry.description}
                      </p>
                      {entry.description.length > 100 && (
                        <button
                          onClick={() => toggleEntryExpansion(entry.id)}
                          className={`mt-2 text-xs ${emotion.color} hover:underline transition-colors duration-200`}
                        >
                          {isEntryExpanded ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Decorative element */}
                  <div
                    className={`mt-3 h-1 w-12 bg-gradient-to-r ${emotion.dotBg} rounded-full opacity-60`}
                  />
                </div>
              </div>
            );
          })}

          {/* End marker */}
          <div className="relative">
            <div className="absolute left-8 -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full border-2 border-slate-700 shadow" />
          </div>
        </div>
      </div>

      {/* Collapsed state indicators */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-20 space-y-3 ${isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"} transition-all duration-300`}
      >
        {sortedEntries.map((entry, index) => {
          const emotion = emotionConfig[entry.emotion] || emotionConfig.NEUTRAL;
          return (
            <div
              key={index}
              className={`w-2 h-2 bg-gradient-to-br ${emotion.dotBg} rounded-full shadow-sm`}
              style={{
                animationDelay: `${index * 200}ms`
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
