import * as faceapi from "face-api.js";

// Load face-api.js models
export const loadModels = async () => {
  try {
    // Load models from local directory
    const MODEL_URL = "/model";

    // Load all required models
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
    ]);
  } catch (error) {
    console.error("Error loading face-api.js models:", error);
    throw error;
  }
};

// Create a singleton instance of face-api.js
let faceApiInstance = null;

export const getFaceApi = async () => {
  if (!faceApiInstance) {
    // Initialize face-api.js with Tiny Face Detector
    faceApiInstance = await faceapi.nets.tinyFaceDetector.loadFromUri("/model");
  }
  return faceApiInstance;
};

// Export a function to detect faces with landmarks and expressions
export const detectFaces = async (video, canvas) => {
  const displaySize = { width: video.width, height: video.height };

  // Create a temporary canvas for processing with willReadFrequently
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = video.width;
  tempCanvas.height = video.height;
  const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });

  // Draw video to temp canvas
  tempCtx.drawImage(video, 0, 0);

  // Process detections on temp canvas
  const detections = await faceapi
    .detectAllFaces(tempCanvas, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions();

  const resizedDetections = faceapi.resizeResults(detections, displaySize);

  // Draw detections on original canvas
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  faceapi.draw.drawDetections(canvas, resizedDetections);
  faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

  return resizedDetections;
};
