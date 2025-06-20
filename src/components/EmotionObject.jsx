import { useState, useRef, useMemo, useEffect } from "react";
import { Html, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

/**
 * Object used to represent a journal entry in an emotion zone. Default shape is a tree.
 */
const EmotionObject = ({
  position,
  journalEntry,
  displayDeleteConfirmation,
  setSelectedEntryId,
  onOpenMemoryForm,
  isNew,
  pathToModel = "/models/tree.glb",
  scale = 3
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const treeRef = useRef();
  const popupRef = useRef();

  const { scene } = useGLTF(pathToModel);
  const tree = useMemo(() => {
    const clonedTree = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clonedTree);
    const bottom = box.min.y;
    clonedTree.position.y = -bottom;
    return clonedTree;
  }, [scene]);

  const handlePointerEnter = (e) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  };

  const handlePointerLeave = (e) => {
    e.stopPropagation();
    document.body.style.cursor = "default";
  };

  const handlePointerDown = (e) => {
    e.stopPropagation();
    if (e.button === 0) {
      if (e.altKey) {
        // Alt+left click - open edit form
        onOpenMemoryForm(journalEntry);
      } else if (e.ctrlKey) {
        // Ctrl+left click - trigger delete
        setSelectedEntryId(journalEntry.id);
        displayDeleteConfirmation();
      } else {
        // Regular left click - show popup
        setShowInfo(true);
      }
    }
  };

  const handleClose = () => {
    setShowInfo(false);
  };

  // Auto-close after 20 seconds
  useEffect(() => {
    if (!showInfo) return;

    const timeout = setTimeout(() => {
      setShowInfo(false);
    }, 20000);

    return () => clearTimeout(timeout);
  }, [showInfo]);

  // Close on outside click and handle F key
  useEffect(() => {
    if (!showInfo) return;

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowInfo(false);
      }
    };

    const handleKeyPress = (event) => {
      if (event.key === "F" || event.key === "f") {
        setShowInfo(false);
        if (onOpenMemoryForm) {
          onOpenMemoryForm();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [showInfo, onOpenMemoryForm]);

  return (
    <RigidBody
      ref={treeRef}
      position={position}
      type="fixed"
      colliders="trimesh"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerOver={handlePointerEnter}
      onPointerOut={handlePointerLeave}
      onPointerDown={handlePointerDown}
      scale={scale}
    >
      <primitive object={tree} />

      {isNew && (
        <Html position={[0, 2, 0]} distanceFactor={40} zIndexRange={[1000, 0]}>
          <div className="bg-red-600 text-white text-base font-bold px-4 py-1 rounded-full shadow-lg animate-pulse">
            NEW
          </div>
        </Html>
      )}

      {showInfo && (
        <Html fullscreen zIndexRange={[1000, 0]}>
          <div
            ref={popupRef}
            className="rounded-2xl bg-black/50 backdrop-blur-lg text-white shadow-2xl border border-gray-600 w-[450px] max-h-[500px] overflow-auto relative animate-fade-in duration-300 ease-in-out custom-scrollbar"
            style={{
              pointerEvents: "auto",
              userSelect: "none",
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.3) rgba(0,0,0,0.1)",
              WebkitScrollbar: {
                width: "8px",
                height: "8px"
              },
              WebkitScrollbarTrack: {
                background: "rgba(0,0,0,0.1)",
                borderRadius: "4px"
              },
              WebkitScrollbarThumb: {
                background: "rgba(255,255,255,0.3)",
                borderRadius: "4px"
              },
              WebkitScrollbarThumbHover: {
                background: "rgba(255,255,255,0.5)"
              }
            }}
          >
            <div className="p-6 space-y-6 max-w-[400px]">
              <button
                onClick={handleClose}
                className="absolute top-3 right-4 text-xl font-bold text-white hover:text-gray-300"
              >
                &times;
              </button>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-sm font-medium text-gray-300 min-w-[60px]">
                    Title:
                  </span>
                  <h3 className="text-2xl font-bold text-white whitespace-pre-wrap break-words">
                    {journalEntry.title}
                  </h3>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-sm font-medium text-gray-300 min-w-[60px]">
                    Date:
                  </span>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap break-words">
                    {journalEntry.date}
                  </p>
                </div>
                <div className="flex items-start">
                  <span className="text-sm font-medium text-gray-300 min-w-[80px] mr-2">
                    Description:
                  </span>
                  <div className="text-base leading-relaxed whitespace-pre-wrap break-words text-white max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {journalEntry.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Html>
      )}
    </RigidBody>
  );
};

useGLTF.preload("/models/tree.glb");
export default EmotionObject;
