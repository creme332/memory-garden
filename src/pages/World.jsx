import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { useParams } from "react-router";

import ConfirmationModal from "../components/ConfirmationModal";
import WelcomeModal from "../components/WelcomeModal";
import HeaderHUD from "../components/HeaderHUD";
import MemoryFormModal from "../components/MemoryFormModal";
import Loader from "../components/Loader";

import MossTerrain from "../components/MossTerrain/Terrain";
import LavaTerrain from "../components/LavaTerrain/Terrain";
import RockTerrain from "../components/RockTerrain/Terrain";
import SandTerrain from "../components/SandTerrain/Terrain";

import SceneSky from "../components/Weather/SceneSky";
import ZoneAudio from "../components/Weather/ZoneAudio";
import Therapist from "../components/Character/Therapist";
import VRMode from "../components/VRMode";
import { CharacterController } from "../components/Character/CharacterController";
import Timeline from "../components/Timeline";
import CameraCapture from "../components/CameraCapture";

import { Emotions } from "../model/Emotion";
import { db } from "../model/DatabaseManager";
import { useNavigate } from "react-router";

// Define size of an emotion zone
export const TERRAIN_WIDTH = 50;
export const TERRAIN_LENGTH = 50;

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] }
];

const VIEW_MODES = {
  CHARACTER: "character",
  VR: "vr",
  ORBITAL: "orbital"
};

export default function World() {
  /**
   * Get journal ID from URL
   */
  const { journalId } = useParams();

  /**
   * Whether or not welcome message is visible.
   */
  const [showWelcome, setShowWelcome] = useState(false);

  /**
   * Whether or not form for creating/editing a memory is visible.
   */
  const [showMemoryForm, setShowMemoryForm] = useState(false);

  /**
   * Whether or not confirmation modal for deleting a memory is visible.
   */
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  /**
   * ID of journal entry to be edited/deleted as selected by user.
   */
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  /**
   * Zone in which user is currently in.
   */
  const [currentZone, setCurrentZone] = useState(Emotions.HAPPY);

  /**
   * State for controlling the application view mode
   * @type {string} One of: 'character', 'vr', 'orbital'
   */

  const [viewMode, setViewMode] = useState(VIEW_MODES.CHARACTER);

  /**
   * Stores detail about a journal but NOT the journal entries.
   */
  const [journal, setJournal] = useState(null);

  /**
   * Array of journal entries for world.
   */
  const [journalEntries, setJournalEntries] = useState([]);

  /**
   * Whether loading animation should be displayed
   */
  const [loading, setLoading] = useState(true);

  /**
   * Stores the ID of the most recently created journal entry.
   * An entry is considered "new" if it was created within the last 5 seconds.
   * This ID is used to visually highlight the new entry in the UI (e.g., with a "New" badge).
   * Only one new entry can be tracked at a time.
   */
  const [newJournalEntryId, setNewJournalEntryId] = useState(null);

  const [initialCharacterPosition, setInitialCharacterPosition] = useState([
    -2, 2, -2
  ]);

  // Add these state variables:
  const [showCamera, setShowCamera] = useState(false);

  // Add this handler:
  const handlePhotoCapture = ({ photo, emotion }) => {
    console.log("Photo captured with emotion:", emotion);
    setShowWelcome(false);

    // set initial position of character
    if (emotion === "happy") {
      setInitialCharacterPosition([-25, 2, -15]);
    } else if (emotion === "sad") {
      setInitialCharacterPosition([25, 2, 25]);
    } else if (emotion === "angry") {
      setInitialCharacterPosition([25, 2, -25]);
    } else {
      setInitialCharacterPosition([-25, 2, 25]);
    }
  };

  // Then add at the beginning of your component:
  const navigate = useNavigate();

  /**
   * Maps an emotion to the `[x, y, z]` position of the corresponding terrain.
   */
  const terrainPositions = {
    [Emotions.HAPPY]: [-TERRAIN_WIDTH / 2, 0, -TERRAIN_LENGTH / 2],
    [Emotions.ANGRY]: [TERRAIN_WIDTH / 2, 0, -TERRAIN_LENGTH / 2],
    [Emotions.NEUTRAL]: [-TERRAIN_WIDTH / 2, 0, TERRAIN_LENGTH / 2],
    [Emotions.SAD]: [TERRAIN_WIDTH / 2, 0, TERRAIN_LENGTH / 2]
  };

  /**
   * Maps an emotion to a terrain.
   */
  const emotionToTerrain = {
    [Emotions.HAPPY]: SandTerrain,
    [Emotions.ANGRY]: LavaTerrain,
    [Emotions.NEUTRAL]: MossTerrain,
    [Emotions.SAD]: RockTerrain
  };

  /**
   * Determines which emotion zone a given 3D position falls into.
   *
   * @param {{ x: number, y: number, z: number }} position - The 3D position to check.
   * @returns {string|null} The emotion associated with the zone the position falls into,
   *                        or null if it doesn't fall into any defined zone.
   */
  const getZoneFromPosition = (position) => {
    const x = position.x;
    const z = position.z;
    const halfWidth = TERRAIN_WIDTH / 2;
    const halfLength = TERRAIN_LENGTH / 2;

    for (const [zone, zonePosition] of Object.entries(terrainPositions)) {
      const [centerX, , centerZ] = zonePosition;

      if (
        x >= centerX - halfWidth &&
        x <= centerX + halfWidth &&
        z >= centerZ - halfLength &&
        z <= centerZ + halfLength
      ) {
        return zone;
      }
    }

    return null;
  };

  const addToJournal = (journalEntry) => {
    setJournalEntries((prev) => [...prev, journalEntry]);

    db.entries.add(journalEntry);

    // Save ID of newly created journal entry
    setNewJournalEntryId(journalEntry.id);

    // Automatically clear the indicator after 5 seconds
    setTimeout(() => {
      setNewJournalEntryId(null);
    }, 5000);
  };

  const updateJournalEntry = (updatedEntry) => {
    setJournalEntries((prev) =>
      prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))
    );
    db.entries.put(updatedEntry);
  };

  const handleDeleteEntry = (entryId) => {
    setJournalEntries((prev) => prev.filter((entry) => entry.id !== entryId));
    setShowDeleteConfirmation(false);
    db.entries.delete(entryId);
  };

  useEffect(() => {
    async function fetchJournal() {
      const entries = await db.entries
        .where("journalId")
        .equalsIgnoreCase(journalId)
        .toArray();

      const fetchedJournal = await db.journals.get({ id: journalId });
      if (!fetchedJournal) {
        alert("Journal not found");
        return;
      }

      setJournal(fetchedJournal);
      console.log("Fetched journal", fetchedJournal);

      console.log("Initial entries", entries);
      setJournalEntries(entries);
      setLoading(false);
    }

    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "f" && !showMemoryForm) {
        e.preventDefault(); // Optional: prevent default "Find" behavior
        setShowMemoryForm(true);
        setSelectedEntryId(null);
      }

      if (e.key === "Escape") {
        setShowMemoryForm(false);
      }

      if (!showMemoryForm && e.key.toLowerCase() === "v" && e.ctrlKey) {
        setViewMode((currentMode) => {
          // Cycle through view modes
          switch (currentMode) {
            case VIEW_MODES.CHARACTER:
              return VIEW_MODES.VR;

            case VIEW_MODES.VR:
              return VIEW_MODES.ORBITAL;

            case VIEW_MODES.ORBITAL:
              return VIEW_MODES.CHARACTER;

            default:
              return VIEW_MODES.CHARACTER;
          }
        });
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    fetchJournal();
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showMemoryForm, journalId]);

  if (!journalId) {
    alert("Missing journal ID");
    return;
  }

  if (loading) return <Loader />;

  function handleCameraOpen() {
    setShowCamera(true);
  }

  return (
    <div className="w-screen h-screen fixed top-0 left-0 m-0 p-0 overflow-hidden">
      {showWelcome && (
        <WelcomeModal onClose={handleCameraOpen} worldName={journal?.title} />
      )}

      {!showWelcome && <HeaderHUD zoneName={currentZone} viewMode={viewMode} />}

      {showMemoryForm && (
        <MemoryFormModal
          onClose={() => setShowMemoryForm(false)}
          onPlant={addToJournal}
          onEdit={updateJournalEntry}
          currentZone={currentZone}
          journalId={journalId}
          entryToEdit={journalEntries.find(
            (entry) => entry.id === selectedEntryId
          )}
        />
      )}

      <Canvas className="w-full h-full">
        {viewMode === VIEW_MODES.ORBITAL && (
          <OrbitControls
            enabled={true}
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
          />
        )}

        {viewMode === VIEW_MODES.VR && (
          <VRMode
            terrainLength={TERRAIN_LENGTH}
            terrainWidth={TERRAIN_WIDTH}
            onPositionUpdate={(position) => {
              const newZone = getZoneFromPosition(position);
              setCurrentZone(newZone);
            }}
          />
        )}

        {viewMode === VIEW_MODES.CHARACTER && (
          <SceneSky
            currentZone={currentZone}
            sunPosition={terrainPositions[currentZone]}
            terrainPositions={terrainPositions}
            terrainLength={TERRAIN_LENGTH}
            terrainWidth={TERRAIN_WIDTH}
          />
        )}

        {!showWelcome && <ZoneAudio currentZone={currentZone} />}

        <ambientLight intensity={1} />

        <directionalLight
          position={[10, 20, 10]}
          intensity={2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />

        <Suspense fallback={null}>
          <Physics options={{ gravity: [0, -9.81, 0], debug: true }}>
            {Object.entries(emotionToTerrain).map(
              ([emotion, TerrainComponent]) => {
                const Component = TerrainComponent;
                return (
                  <Component
                    key={emotion}
                    terrainWidth={TERRAIN_WIDTH}
                    terrainLength={TERRAIN_LENGTH}
                    onDeleteEntry={handleDeleteEntry}
                    displayDeleteConfirmation={() => {
                      setShowDeleteConfirmation(true);
                    }}
                    setSelectedEntryId={setSelectedEntryId}
                    journal={journalEntries.filter(
                      (el) => el.emotion === emotion
                    )}
                    position={terrainPositions[emotion]}
                    onOpenMemoryForm={(entry) => {
                      setSelectedEntryId(entry.id);
                      setShowMemoryForm(true);
                    }}
                    newJournalEntryId={newJournalEntryId}
                  />
                );
              }
            )}

            {viewMode === VIEW_MODES.CHARACTER && (
              <KeyboardControls map={keyboardMap}>
                <CharacterController
                  terrainWidth={TERRAIN_WIDTH}
                  terrainLength={TERRAIN_LENGTH}
                  initialCharacterPosition={initialCharacterPosition}
                  onPositionUpdate={(position) => {
                    const newZone = getZoneFromPosition(position);
                    setCurrentZone(newZone);
                  }}
                />
              </KeyboardControls>
            )}

            <Therapist
              animation="RobotArmature|Robot_Wave"
              position={[0, 0, 0]}
              scale={1}
              journalEntries={journalEntries}
            />
          </Physics>
        </Suspense>
      </Canvas>

      {/* Confirmation modal for deleting a journal entry. It is position relative to screen instead of canvas. */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => {
          setShowDeleteConfirmation(false);
        }}
        onConfirm={() => {
          if (selectedEntryId) {
            handleDeleteEntry(selectedEntryId);
            setSelectedEntryId(null);
          }
          setShowDeleteConfirmation(false);
        }}
        message="Are you sure you want to delete this memory?"
        memoryDetails={
          journalEntries.find((entry) => entry.id === selectedEntryId) || {}
        }
      />

      {/* Timeline */}
      {!showWelcome && <Timeline entries={journalEntries} />}

      {/* camera */}
      <CameraCapture
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handlePhotoCapture}
      />

      {!showWelcome && (
        <button
          onClick={() => navigate("/profile")}
          className="fixed bottom-6 left-6 z-40 bg-white/80 backdrop-blur-sm text-gray-700 p-3 rounded-full shadow-lg hover:scale-110 transition-all duration-300 border border-gray-200"
          title="Return to Profile"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
