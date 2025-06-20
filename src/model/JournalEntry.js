import { v4 as uuidv4 } from "uuid";
import { Emotions, ALL_EMOTIONS } from "./Emotion";

/**
 * Creates a journal entry.
 * @param {string} date - Date in ISO 8601 format (YYYY-MM-DD).
 * @param {string} description - Description of the journal entry.
 * @param {string} title - Title of the memory (3-50 characters).
 * @param {string} journalId
 * @param {Emotion} - Emotion as defined by Emotions.
 * @returns {{ id: string, date: string, description: string, emotion: string, title: string }} The journal entry object.
 * @throws Will throw an error if the date, emotion, or title is invalid.
 */
export default function JournalEntry(
  date,
  title,
  description,
  journalId,
  emotion
) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(date)) {
    throw new Error(
      `Invalid date format: ${date}. Expected format is YYYY-MM-DD.`
    );
  }

  if (!ALL_EMOTIONS.includes(emotion)) {
    throw new Error(
      `Invalid emotion: ${emotion}. Valid options are ${ALL_EMOTIONS.join(", ")}.`
    );
  }

  if (!title?.trim()) {
    throw new Error("Title is required");
  }

  if (!journalId?.trim()) {
    throw new Error("Journal ID is required");
  }

  const trimmedTitle = title.trim();
  if (trimmedTitle.length < 3) {
    throw new Error("Title must be at least 3 characters long");
  }
  if (trimmedTitle.length > 50) {
    throw new Error("Title cannot be longer than 50 characters");
  }

  return {
    id: uuidv4(),
    date,
    description,
    emotion,
    journalId,
    title: trimmedTitle
  };
}
