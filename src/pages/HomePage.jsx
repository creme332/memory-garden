import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Memory Garden
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform your memories into a beautiful 3D world where each
              emotion has its own unique landscape
            </p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Your Virtual Memory Journal
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Memory Garden is an immersive 3D journaling experience where your
              memories come to life. Each entry is planted as a tree in
              different emotional landscapes, creating a living, breathing
              representation of your inner world.
            </p>
          </div>

          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ready to Start?
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Create your first memory garden and begin your journey
                  </p>

                  <button
                    onClick={handleGetStarted}
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Enter Your Garden
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emotional Zones Section */}
      <section className="bg-white/50 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Four Emotional Landscapes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each emotion gets its own unique environment with distinct
              visuals, sounds, and atmosphere
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-xl">🌅</span>
              </div>
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                Happy
              </h3>
              <p className="text-yellow-700 text-sm">
                Sunny beaches with palm trees and lighthouse views
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-slate-100 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-xl">🌧️</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Sad</h3>
              <p className="text-blue-700 text-sm">
                Rocky terrain with weathered pillars and gentle rain
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-xl">🌋</span>
              </div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">Angry</h3>
              <p className="text-red-700 text-sm">
                Volcanic landscapes with lava flows and fiery atmosphere
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-xl">🌿</span>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Neutral
              </h3>
              <p className="text-green-700 text-sm">
                Peaceful moss-covered terrain with gentle rainfall
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need for an immersive journaling experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Interactive 3D World
              </h3>
              <p className="text-gray-600">
                Navigate through your memories using character controls, VR
                mode, or orbital camera
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg mb-4 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI Therapist
              </h3>
              <p className="text-gray-600">
                Chat with Dr. Memoria Hortus, your virtual therapist guide who
                provides support and conversation
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg mb-4 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Dynamic Weather
              </h3>
              <p className="text-gray-600">
                Each emotional zone has its own weather, lighting, and
                atmospheric effects that enhance the mood
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Memory Garden
            </h3>
            <p className="text-gray-400 mb-4">
              Transform your memories into beautiful 3D experiences
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>© 2025 Memory Garden</span>
              <span>•</span>
              <span>Made with ❤️ for better mental health</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
