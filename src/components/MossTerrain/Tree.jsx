import EmotionObject from "../EmotionObject";
import { useRef } from "react";
import { generateTreePositions } from "./Utils.js";

/**
 * Tree component that renders EmotionObjects in a grid pattern over the terrain.
 */
const Tree = ({
  journal = [],
  terrainWidth,
  terrainLength,
  onDeleteEntry,
  displayDeleteConfirmation,
  setSelectedEntryId,
  onOpenMemoryForm,
  obstaclesPositions = [],
  newJournalEntryId
}) => {
  const treePositionsRef = useRef(new Map());

  const obstacles = obstaclesPositions.map((pos) => ({
    position: pos,
    radius: 5
  }));

  generateTreePositions(
    journal,
    obstacles,
    treePositionsRef,
    terrainWidth,
    terrainLength
  );

  return (
    <>
      {journal.map((entry, idx) => (
        <EmotionObject
          key={idx}
          position={treePositionsRef.current.get(entry.id)}
          journalEntry={entry}
          onDelete={onDeleteEntry}
          displayDeleteConfirmation={displayDeleteConfirmation}
          setSelectedEntryId={setSelectedEntryId}
          onOpenMemoryForm={onOpenMemoryForm}
          isNew={entry.id === newJournalEntryId}
        />
      ))}
    </>
  );
};

export default Tree;
