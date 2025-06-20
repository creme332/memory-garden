// Define the Emotion object and freeze it for immutability
export const Emotions = Object.freeze({
  ANGRY: "Angry",
  HAPPY: "Happy",
  SAD: "Sad",
  NEUTRAL: "Neutral"
});

export const ALL_EMOTIONS = Object.freeze(Object.values(Emotions));
