import { useRef, useState, useEffect } from "react";
import { useGLTF, useAnimations, Html } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  generateText,
  getCacheKey,
  getFromCache,
  addToCache
} from "../../services/AIService";
import Markdown from "marked-react";

const MODEL_URL = "/models/Animated Robot.glb";

export default function Therapist({
  characterRef,
  scale = [1, 1, 1],
  journalEntries = [],
  ...props
}) {
  const animation = "RobotArmature|Robot_Wave";
  const group = useRef();
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);

  const [showChatButton, setShowChatButton] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [objectHeight, setObjectHeight] = useState(2.5);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Following behavior variables
  const [targetPosition, setTargetPosition] = useState([0, 0, 0]);
  const followDistance = 5;
  const followSpeed = 0.02;

  // Get the 5 most recent journal entries
  const getRecentJournalEntries = () => {
    return journalEntries
      .sort(
        (a, b) =>
          new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
      )
      .slice(0, 5);
  };

  // Generate context with journal entries
  const generateInitialContext = () => {
    const entries = getRecentJournalEntries();

    if (entries.length === 0) {
      return `You are Dr. Memoria Hortus, a virtual therapist.

Instructions:
- Speak naturally and directly, as if having a calm, supportive conversation.
- Do NOT include any stage directions or emotional descriptions (e.g., "(smiles)", "(voice is warm)", etc.).
- No roleplay. No internal narration. Just words you'd say out loud in a real conversation.

The user has not submitted any journal entries yet.

Focus on:
- Checking in with how they’re feeling
- Offering practical mental health support
- Encouraging them to start journaling`;
    }

    const history = entries
      .map(
        (entry, i) =>
          `${i + 1}. ${entry.date || entry.createdAt}: "${entry.title}" | Emotion: ${entry.emotion}`
      )
      .join("\n");

    return `You are Dr. Memoria Hortus, a virtual therapist.

Instructions:
- Speak naturally and directly, as if having a calm, supportive conversation.
- Do NOT include any stage directions or emotional descriptions (e.g., "(smiles)", "(voice is warm)", etc.).
- No roleplay. No internal narration. Just words you'd say out loud in a real conversation.

Here is the user's recent journal history:

${history}

Based on these entries:
- Offer brief supportive reflections
- Point out any clear emotional patterns
- Ask thoughtful, simple questions that help them reflect further`;
  };

  useEffect(() => {
    if (scene && group.current) {
      const box = new THREE.Box3().setFromObject(scene);
      const height = box.max.y - box.min.y;
      setObjectHeight(height);
    }
  }, [scene]);

  // Follow the character
  useFrame(() => {
    if (characterRef?.current && group.current) {
      const characterPosition = characterRef.current.translation();
      if (characterPosition) {
        const offset = new THREE.Vector3(-followDistance, 0, 0);
        const newTarget = [
          characterPosition.x + offset.x,
          characterPosition.y,
          characterPosition.z + offset.z
        ];

        setTargetPosition(newTarget);

        const currentPos = group.current.position;
        currentPos.lerp(
          new THREE.Vector3(newTarget[0], newTarget[1], newTarget[2]),
          followSpeed
        );

        const lookDirection = new THREE.Vector3(
          characterPosition.x - currentPos.x,
          0,
          characterPosition.z - currentPos.z
        ).normalize();

        if (lookDirection.length() > 0) {
          const angle = Math.atan2(lookDirection.x, lookDirection.z);
          group.current.rotation.y = angle;
        }
      }
    }
  });

  const handlePointerEnter = () => {
    document.body.style.cursor = "pointer";
    actions[animation]?.reset().play();
    setShowChatButton(true);
  };

  const handlePointerLeave = () => {
    document.body.style.cursor = "default";
    actions[animation]?.fadeOut(0.5);
    setShowChatButton(false);
  };

  const generateWelcomeMessage = () => {
    const recentEntries = getRecentJournalEntries();

    if (recentEntries.length === 0) {
      return "Hello! I'm Dr. Memoria Hortus. I'm here to listen and support you on your emotional journey. How are you feeling today?";
    }

    const latestEntry = recentEntries[0];
    return `Hello! I'm Dr. Memoria Hortus. I've been observing your journey through the Memory Garden. I noticed your recent entry "${latestEntry.title}" reflects ${latestEntry.emotion} feelings. I'm here to listen and support you. How are you feeling right now?`;
  };

  const handleUserInput = async (userInput) => {
    if (!userInput.trim()) {
      return;
    }

    setIsLoading(true);

    // Add user message to conversation
    const userMessage = { role: "user", content: userInput };
    setConversationHistory((prev) => [...prev, userMessage]);

    try {
      const initialContext = generateInitialContext();

      // Create context for AI including journal data and conversation history
      const contextArray = [initialContext];
      conversationHistory.forEach((msg) => {
        contextArray.push(`${msg.role}: ${msg.content}`);
      });
      contextArray.push(`user: ${userInput}`);

      // Generate cache key
      const cacheKey = getCacheKey(contextArray);

      // Check cache first
      let response = getFromCache(cacheKey);

      if (!response) {
        // Generate new response with full context
        response = await generateText(userInput, contextArray);
        addToCache(cacheKey, response);
      }

      // Add assistant response to conversation
      setConversationHistory((prev) => [
        ...prev,
        { role: "assistant", content: response }
      ]);

      setIsLoading(false);
    } catch (error) {
      console.error("Error getting therapist response:", error);
      const errorMessage =
        error.message ||
        "I apologize, but I encountered an error. Please try again.";

      setConversationHistory((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage }
      ]);

      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    setConversationHistory([]);
    setIsLoading(false);
  };

  return (
    <group
      ref={group}
      position={targetPosition}
      scale={scale}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerOut={handlePointerLeave}
      onClick={setShowChat}
      {...props}
    >
      <RigidBody type="kinematicPosition" colliders="trimesh">
        <primitive object={scene} />
      </RigidBody>

      {/* Floating Chat Icon */}
      {showChatButton && (
        <Html
          position={[0, objectHeight + 1, 0]}
          transform
          sprite
          className="pointer-events-auto"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (!showChat) {
                resetConversation();
              }
              setShowChat(!showChat);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
        </Html>
      )}

      {/* Interactive Conversation Interface */}
      {showChat && (
        <Html
  position={[0, objectHeight - 4, 0]}
  transform
  sprite
  className="pointer-events-auto"
>
  <div className="relative min-w-[440px] max-w-[500px] font-sans">
    {/* Outer glow effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-emerald-500/20 to-cyan-500/20 rounded-[2rem] blur-xl scale-105"></div>
    
    {/* Main container */}
    <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl rounded-[2rem] p-6 shadow-2xl border border-white/10 overflow-hidden">
      
      {/* Animated background mesh */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-600/10 via-transparent to-emerald-600/10"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-br from-violet-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4">
          <div className="flex items-center space-x-4">
            {/* AI Avatar */}
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 via-cyan-400 to-violet-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="w-8 h-8 bg-white/90 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <div className="w-3 h-3 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"></div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent m-0">
                Dr. Memoria Hortus
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <p className="text-xs text-slate-400 m-0 font-medium">
                  AI Therapist • {getRecentJournalEntries().length} insights ready
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetConversation();
              }}
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/5 hover:border-white/20"
              title="New conversation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowChat(false);
              }}
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/5 hover:border-red-400/30"
              title="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Welcome Message */}
        {conversationHistory.length === 0 && (
          <div className="relative mb-6 group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur-sm"></div>
            <div className="relative bg-gradient-to-r from-emerald-900/40 to-cyan-900/40 border border-emerald-400/30 rounded-2xl px-6 py-4 backdrop-blur-sm">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center mt-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-emerald-100 m-0 leading-relaxed">
                    {generateWelcomeMessage()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="space-y-4 max-h-[440px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pr-2">
          {conversationHistory.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } animate-in slide-in-from-bottom-3 duration-500`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {message.role === "user" ? (
                <div className="relative max-w-[80%] group">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 to-emerald-500/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-violet-600 to-emerald-600 text-white rounded-2xl rounded-br-md px-5 py-3 shadow-lg">
                    <Markdown className="text-sm leading-relaxed">{message.content}</Markdown>
                  </div>
                </div>
              ) : (
                <div className="relative max-w-[85%] group">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-slate-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-slate-800/80 backdrop-blur-sm border border-white/10 text-slate-100 rounded-2xl rounded-bl-md px-5 py-3 shadow-lg">
                    <Markdown className="text-sm leading-relaxed">{message.content}</Markdown>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-in slide-in-from-bottom-3 duration-500">
              <div className="relative max-w-[85%]">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl blur-sm animate-pulse"></div>
                <div className="relative bg-slate-800/80 backdrop-blur-sm border border-emerald-400/20 text-slate-100 rounded-2xl rounded-bl-md px-5 py-4 shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gradient-to-r from-violet-400 to-emerald-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-slate-300">
                      Processing your emotional patterns...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="mt-6 space-y-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-emerald-500/20 to-cyan-500/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <input
                type="text"
                placeholder="Express your thoughts freely..."
                className="w-full p-4 pr-14 rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all duration-300 text-sm text-white placeholder-slate-400 shadow-lg"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    handleUserInput(e.target.value);
                    e.target.value = "";
                  }
                }}
                disabled={isLoading}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const input = e.target.closest('.relative').querySelector('input');
                  if (input && input.value.trim()) {
                    handleUserInput(input.value);
                    input.value = "";
                    input.focus();
                  }
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
                title="Send message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Status bar */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Secure & Confidential</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Press Enter to send</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</Html>
      )}
    </group>
  );
}
