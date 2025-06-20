import axios from "axios";

// Rate limiting configuration
const MAX_REQUESTS_PER_MINUTE = 10;
const REQUEST_QUEUE = [];
let LAST_REQUEST_TIME = 0;

const OLLAMA_API_URL = "http://localhost:11434/api/generate";

// Add error handling middleware
const errorHandler = async (request) => {
  try {
    const response = await request();
    return response;
  } catch (error) {
    console.error("Ollama API Error:", error);
    throw new Error(`Ollama API Error: ${error.message}`);
  }
};

// Update request queue to use error handler
export async function addToQueue(request) {
  return new Promise((resolve, reject) => {
    REQUEST_QUEUE.push([resolve, reject, () => errorHandler(request)]);
    processRequestQueue();
  });
}

// Ollama API functions
export async function generateText(prompt, context = []) {
  const fullPrompt = [...context, prompt].join("\n");
  try {
    const response = await axios.post(OLLAMA_API_URL, {
      model: "gemma3:1b",
      prompt: fullPrompt,
      stream: false
    });

    // Extract the text from Ollama's response
    const text = response.data.response;
    return text;
  } catch (error) {
    console.error("Ollama API Error:", error);
    throw new Error(`Ollama API Error: ${error.message}`);
  }
}

// Request queue management
export async function processRequestQueue() {
  if (REQUEST_QUEUE.length === 0) return;

  const currentTime = Date.now();
  const timeSinceLastRequest = (currentTime - LAST_REQUEST_TIME) / 1000;

  // Check if we need to wait before processing next request
  if (timeSinceLastRequest < 60 / MAX_REQUESTS_PER_MINUTE) {
    const waitTime =
      (60 / MAX_REQUESTS_PER_MINUTE - timeSinceLastRequest) * 1000;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  const [resolve, reject, request] = REQUEST_QUEUE.shift();
  try {
    const result = await request();
    LAST_REQUEST_TIME = Date.now();
    resolve(result);
  } catch (error) {
    if (error.message.includes("Rate limit exceeded")) {
      // Add exponential backoff for rate limits
      const retryCount = REQUEST_QUEUE.filter((r) => r[2] === request).length;
      const waitTime = Math.pow(2, retryCount) * 1000;
      setTimeout(() => addToQueue(request), waitTime);
      return;
    }
    reject(error);
  }
}

// Enhanced Cache Management
const CACHE_SIZE_LIMIT = 100; // Maximum number of cached items
const CACHE_DURATION = 300000; // 5 minutes
const CACHE_STATS = {
  hits: 0,
  misses: 0,
  evictions: 0
};

const REQUEST_CACHE = new Map();

// Cache key generation with improved hashing
export function getCacheKey(prompt) {
  const hash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }
    return hash.toString();
  };
  return hash(JSON.stringify(prompt));
}

// Cache retrieval with statistics
export function getFromCache(key) {
  const cached = REQUEST_CACHE.get(key);
  if (cached) {
    const [result, timestamp] = cached;
    if (Date.now() - timestamp < CACHE_DURATION) {
      CACHE_STATS.hits++;
      return result;
    }
    REQUEST_CACHE.delete(key);
  }
  CACHE_STATS.misses++;
  return null;
}

// Cache storage with size limit and statistics
export function addToCache(key, result) {
  if (REQUEST_CACHE.size >= CACHE_SIZE_LIMIT) {
    // Remove oldest item
    const oldestKey = REQUEST_CACHE.keys().next().value;
    REQUEST_CACHE.delete(oldestKey);
    CACHE_STATS.evictions++;
  }
  REQUEST_CACHE.set(key, [result, Date.now()]);
}

// Get cache statistics
export function getCacheStats() {
  return {
    ...CACHE_STATS,
    size: REQUEST_CACHE.size,
    hitRate: CACHE_STATS.hits / (CACHE_STATS.hits + CACHE_STATS.misses) || 0
  };
}

export async function analyzeJournalEntry(
  entry,
  userHistory = [],
  worldData = []
) {
  try {
    // Get the initial context for the therapist
    const initialContext = {
      role: "system",
      content: `You are Dr. Memoria Hortus, a compassionate and professional virtual therapist.
      You have access to the user's journal history and world data to provide more personalized insights.
      
      User's Journal History:
${userHistory.map((entry, index) => `${index + 1}. ${entry.date}: ${entry.title} - ${entry.emotion}`).join("\n")}

      World Data:
${worldData.map((entry, index) => `${index + 1}. ${entry.date}: ${entry.title} - ${entry.emotion}`).join("\n")}

      Current Entry:
${entry.date}: ${entry.title}
Emotion: ${entry.emotion}
Description: ${entry.description}

Provide an empathetic analysis of the current entry, incorporating relevant patterns from the user's history and world data. Focus on emotional understanding and supportive insights.`
    };

    // Use the existing generateText function with Ollama
    const response = await generateText(
      "Analyze this journal entry and provide supportive insights.",
      [
        initialContext,
        {
          role: "user",
          content: "Analyze this journal entry and provide supportive insights."
        }
      ]
    );

    // Format the analysis as a message
    return {
      role: "assistant",
      content: response
    };
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error(
        "Rate limit exceeded. Please try again in a few minutes."
      );
    }
    console.error("Error analyzing journal entry:", error);
    throw error;
  }
}
