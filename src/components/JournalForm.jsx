import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

/**
 * A form for creating or editing a journal. It appears in the form of a modal and closes after form submission.
 */
export default function JournalForm({
  onSubmit,
  setShowJournalForm,
  initialJournal = null
}) {
  /**
   * Whether a new journal is being created. If false, an existing journal is being edited.
   */
  const isCreatingNewJournal = !initialJournal;

  const [title, setTitle] = useState(initialJournal?.title || "");
  const [isPublic, setIsPublic] = useState(initialJournal?.isPublic || false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const journalPayload = initialJournal
      ? { ...initialJournal, title }
      : { id: uuidv4(), title };

    onSubmit(journalPayload);

    // clear values
    setTitle("");
    setIsPublic(false);
    setShowJournalForm(false);
  };

  return (
    <div className="p-6">
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md relative">
          <h2 className="text-xl font-semibold mb-4">Create New Journal</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-700">
                Make Public
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowJournalForm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {isCreatingNewJournal ? "Create" : "Edit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
