import { useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

function ZoneAudio({ currentZone }) {
  const { camera } = useThree();

  useEffect(() => {
    const audioUrl = {
      Happy: "/audio/Happy.mp3",
      Sad: "/audio/Sad.mp3",
      Neutral: "/audio/Neutral.mp3",
      Angry: "/audio/Angry.mp3"
    };

    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();

    // Load and play only the current zone's audio
    const currentAudioUrl = audioUrl[currentZone];
    if (currentAudioUrl) {
      audioLoader.load(currentAudioUrl, (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        sound.play();
      });
    }

    return () => {
      sound.stop();
      camera.remove(listener);
    };
  }, [camera, currentZone]);
}

export default ZoneAudio;
