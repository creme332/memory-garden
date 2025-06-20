import { Sky } from "@react-three/drei";
import Rain from "./Rain";
import { Emotions } from "../../model/Emotion";

const SceneSky = ({
  currentZone,
  sunPosition = [],
  terrainPositions = {},
  terrainLength,
  terrainWidth
}) => {
  const yOffsets = {
    [Emotions.HAPPY]: 10,
    [Emotions.SAD]: 0,
    [Emotions.ANGRY]: -10,
    [Emotions.NEUTRAL]: 5
  };

  return (
    <>
      {currentZone === Emotions.NEUTRAL && (
        <Rain
          terrainLength={terrainLength}
          terrainWidth={terrainWidth}
          position={terrainPositions[Emotions.NEUTRAL]}
          count={terrainLength * terrainWidth} // moderate rain
        />
      )}

      {currentZone === Emotions.SAD && (
        <Rain
          terrainLength={terrainLength}
          terrainWidth={terrainWidth}
          position={terrainPositions[Emotions.SAD]}
          count={terrainLength * terrainWidth * 4} // heavier rain, but not insane
        />
      )}

      <Sky
        distance={45000}
        sunPosition={[sunPosition[0], yOffsets[currentZone], sunPosition[2]]}
        turbidity={10}
        rayleigh={2}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      {currentZone === Emotions.HAPPY && (
        <fog attach="fog" args={["#fff4cc", 10, 80]} />
      )}

      {currentZone === Emotions.SAD && (
        <fog attach="fog" args={["#111111", 5, 40]} />
      )}

      {currentZone === Emotions.ANGRY && (
        <fog attach="fog" args={["#4a1a0a", 5, 40]} />
      )}

      {currentZone === Emotions.NEUTRAL && (
        <fog attach="fog" args={["#8A9A5B", 5, 40]} />
      )}
    </>
  );
};

export default SceneSky;
