import React, { useState } from "react";
import { motion } from "framer-motion";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  message = "Are you sure you want to delete this tree?",
  memoryDetails = {}
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-auto custom-scrollbar"
      >
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">{message}</h3>
          {memoryDetails.title && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  <span className="text-gray-600">Title:</span>
                  <span className="font-medium text-gray-800 break-words">
                    {memoryDetails.title}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium text-gray-800 break-words">
                    {memoryDetails.date}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-gray-600">Description:</span>
                  <p className="font-medium text-gray-700 break-words">
                    {memoryDetails.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmationModal;
