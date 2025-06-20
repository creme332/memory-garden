import React, { useRef, useState, useEffect } from "react";
import { Camera, X, RotateCcw, Check, AlertCircle } from "lucide-react";
import { loadModels, detectFaces } from "../utils/face-api-utils";

const CameraCapture = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [emotionLoading, setEmotionLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera(); // cleanup
  }, [isOpen]);

  const startCamera = async () => {
    setLoading(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play(); // ensure autoplay works
        setStreaming(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Unable to access camera. Please check permissions.");
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  };

  const takePhoto = async () => {
    const video = videoRef.current;
    if (!video) return;

    // Wait for video to be ready and have valid dimensions
    await new Promise((resolve) => {
      const checkVideo = () => {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          resolve();
        } else {
          requestAnimationFrame(checkVideo);
        }
      };
      checkVideo();
    });

    // Load face detection models
    try {
      setEmotionLoading(true);
      await loadModels();
    } catch (error) {
      console.error("Error loading models:", error);
      setError("Failed to load face detection models");
      return;
    }

    // Create canvas for face detection with willReadFrequently
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      console.error("Failed to get canvas context");
      return;
    }

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setPhoto(dataUrl);

    // Perform face detection and emotion analysis
    try {
      // Create a temporary canvas for face detection
      const detectionCanvas = document.createElement("canvas");
      detectionCanvas.width = video.videoWidth;
      detectionCanvas.height = video.videoHeight;
      const detectionCtx = detectionCanvas.getContext("2d");
      detectionCtx.drawImage(video, 0, 0);

      const detections = await detectFaces(detectionCanvas, detectionCanvas);
      if (detections.length > 0) {
        // Get the most confident emotion
        const expressions = detections[0].expressions;
        const mostConfidentEmotion = Object.entries(expressions).reduce(
          (a, b) => (a[1] > b[1] ? a : b)
        )[0];
        setEmotion(mostConfidentEmotion);
      } else {
        setEmotion("No face detected");
      }
    } catch (error) {
      console.error("Error detecting face:", error);
      setEmotion("Error detecting face");
    } finally {
      setEmotionLoading(false);
    }

    stopCamera(); // Stop camera after photo
  };

  const handleSave = () => {
    if (photo) {
      onCapture({ photo, emotion });
      setPhoto(null);
      onClose();
    }
  };

  const handleRetake = () => {
    setPhoto(null);
    startCamera();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Camera className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Camera</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error ? (
            <div className="flex flex-col items-center justify-center gap-4 p-6">
              <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={takePhoto}
                  disabled={!streaming || loading}
                  className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-6 h-6" />
                </button>
              </div>
              {emotionLoading && (
                <div className="mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
              {emotion && !emotionLoading && (
                <div className="mt-4 p-4 bg-blue-100 rounded-lg text-blue-600">
                  <p className="text-lg font-semibold">
                    Detected Emotion: {emotion}
                  </p>
                </div>
              )}
            </div>
          ) : !photo ? (
            <div className="space-y-4">
              {/* Video Container */}
              <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ display: streaming ? "block" : "none" }}
                />
                {streaming && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Camera grid overlay */}
                    <div className="absolute inset-4 border border-white/20 rounded-lg">
                      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className="border-r border-b border-white/10 last:border-r-0 [&:nth-child(3n)]:border-r-0 [&:nth-child(n+7)]:border-b-0"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Capture Button */}
              {streaming && (
                <div className="flex justify-center">
                  <button
                    onClick={takePhoto}
                    className="group relative p-4 bg-blue-500 hover:bg-blue-600 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-200"></div>
                    <Camera className="w-8 h-8 text-white relative z-10" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Photo Preview */}
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                <img
                  src={photo}
                  alt="Captured"
                  className="w-full h-full object-cover animate-in fade-in duration-300"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleRetake}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200 font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retake
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  <Check className="w-4 h-4" />
                  Use Photo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
