import { useState } from "react";
import JournalEntry from "../model/JournalEntry";

/**
 * Form used for creating a new memory or editing an existing memory.
 */
const MemoryFormModal = ({
  onClose,
  onPlant,
  currentZone,
  entryToEdit,
  onEdit,
  journalId
}) => {
  const [formData, setFormData] = useState({
    journalId,
    title: entryToEdit?.title || "",
    date: entryToEdit?.date || getCurrentDate(),
    description: entryToEdit?.description || ""
  });

  const [errors, setErrors] = useState({});

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, title: value }));
    validateField("title", value);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  /**
   *
   * @returns Current date as string in YYYY-MM-DD format.
   */
  function getCurrentDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case "date": {
        const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
        if (!dateRegex.test(value)) {
          newErrors.date = "Please enter a valid date";
        } else {
          delete newErrors.date;
        }
        break;
      }
      case "description": {
        if (!value || value.trim().length === 0) {
          newErrors.description = "Description is required";
        } else {
          delete newErrors.description;
        }
        break;
      }
      case "title": {
        if (!value || value.trim().length === 0) {
          newErrors.title = "Title is required";
        } else if (value.trim().length < 3) {
          newErrors.title = "Title must be at least 3 characters long";
        } else if (value.trim().length > 50) {
          newErrors.title = "Title cannot be longer than 50 characters";
        } else {
          delete newErrors.title;
        }
        break;
      }
      default:
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};

    // TITLE VALIDATION
    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    } else if (formData.title.trim().length > 50) {
      newErrors.title = "Title cannot be longer than 50 characters";
    }

    // DATE VALIDATION
    const dateRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
    if (!dateRegex.test(formData.date)) {
      newErrors.date = "Please enter a valid date";
    } else {
      const inputDate = new Date(formData.date);
      const today = new Date();
      inputDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (inputDate > today) {
        newErrors.date = "Date cannot be in the future";
      }
    }

    // DESCRIPTION VALIDATION
    if (!formData.description || formData.description.trim().length === 0) {
      newErrors.description = "Description is required";
    }

    // Set all errors and return validity
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate description when it changes
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, description: value }));
    validateField("description", value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (entryToEdit) {
        // Update existing entry
        entryToEdit.date = formData.date;
        entryToEdit.title = formData.title;
        entryToEdit.description = formData.description;

        onEdit(entryToEdit);
      } else {
        const newEntry = JournalEntry(
          formData.date,
          formData.title,
          formData.description,
          journalId,
          currentZone
        );

        // Create new entry
        onPlant(newEntry);
      }
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {entryToEdit ? "Edit Memory" : "Plant a Memory"} in {currentZone} Zone
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter a title for your memory"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => {
                const selectedDate = e.target.value;
                handleChange("date", selectedDate);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={handleDescriptionChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe your memory..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {entryToEdit ? "Save Changes" : "Plant Memory"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default MemoryFormModal;
