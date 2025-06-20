const WelcomeModal = ({ onClose, worldName }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center transform transition-all">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to {worldName || "your world"}!
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            This is your{" "}
            <span className="font-semibold text-blue-600">
              Virtual World Journal
            </span>
          </p>
        </div>

        <div className="mb-8">
          <p className="text-gray-700 mb-4">
            Please feel free to <span className="font-medium">explore</span> and{" "}
            <span className="font-medium">add notes</span> during your journey.
          </p>
        </div>

        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Start Exploring
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;
