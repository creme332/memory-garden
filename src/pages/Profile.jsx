import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import Loader from "../components/Loader";
import JournalForm from "../components/JournalForm";
import { db } from "../model/DatabaseManager";

export default function Profile() {
  let navigate = useNavigate();

  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [editJournal, setEditJournal] = useState(null);
  const [showCopiedModal, setShowCopiedModal] = useState(false);
  const [journalEntryCounts, setJournalEntryCounts] = useState({});

  async function saveJournal(journal) {
    const saveJournalMode = !editJournal;

    if (saveJournalMode) {
      await db.journals.add(journal);
      setJournals([...journals, { ...journal }]);
    } else {
      await db.journals.update(journal.id, journal);
      setJournals((prevJournals) =>
        prevJournals.map((j) =>
          j.id === journal.id ? { ...j, ...journal } : j
        )
      );
    }

    setShowJournalForm(false);
  }

  useEffect(() => {
    async function fetchJournals() {
      setLoading(true);
      const c = await db.journals.toArray();
      setLoading(false);
      setJournals(c);

      // Fetch entry counts for each journal
      const entryCounts = {};
      for (const journal of c) {
        const entries = await db.entries
          .where("journalId")
          .equalsIgnoreCase(journal.id)
          .count();
        entryCounts[journal.id] = entries;
      }
      setJournalEntryCounts(entryCounts);

      console.log("Initial journals", c);
    }

    fetchJournals();
  }, []);

  async function handleDelete(journalId) {
    await db.journals.delete(journalId);
    setJournals(journals.filter((el) => el.id !== journalId));
  }

  const shareJournal = async (journalToShare) => {
    const link = `${window.location.origin}/journals/${journalToShare.id}`;
    await navigator.clipboard.writeText(link);

    setShowCopiedModal(true);
    setTimeout(() => setShowCopiedModal(false), 2000);
  };

  async function handleEditJournal(journalToEdit) {
    setEditJournal(journalToEdit);
    setShowJournalForm(true);
  }

  async function handleCreateJournal() {
    setEditJournal(null);
    setShowJournalForm(true);
  }

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <Link to={"/"}>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Memory Garden
                  </h1>
                </Link>
                <p className="text-sm text-gray-600">
                  Your emotional journey dashboard
                </p>
              </div>
            </div>

            <button
              onClick={handleCreateJournal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Garden
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back! 🌱
              </h2>
              <p className="text-lg text-gray-600">
                Continue nurturing your emotional wellness journey through your
                Memory Gardens
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Journals Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200/50">
            <h3 className="text-2xl font-bold text-gray-900">
              Your Memory Gardens
            </h3>
            <p className="text-gray-600 mt-1">
              Explore and manage your emotional landscapes
            </p>
          </div>

          {journals.length === 0 ? (
            <div className="px-8 py-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                No gardens yet
              </h4>
              <p className="text-gray-600 mb-6">
                Create your first Memory Garden to begin your emotional wellness
                journey
              </p>
              <button
                onClick={handleCreateJournal}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Plant Your First Garden
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
              {journals.map((journal) => (
                <div
                  key={journal.id}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleEditJournal(journal)}
                        className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Edit garden"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(journal.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete garden"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {journal.title}
                  </h4>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">
                      Emotional landscapes and memories
                    </p>
                    <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      {journalEntryCounts[journal.id] || 0} entries
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate(`/journals/${journal.id}`)}
                      className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold py-3 rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      Enter Garden
                    </button>

                    <button
                      onClick={() => shareJournal(journal)}
                      className="w-full bg-white border border-gray-200 text-gray-700 font-medium py-2 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                        />
                      </svg>
                      Share Garden
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Form */}
      {showJournalForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <JournalForm
              onSubmit={saveJournal}
              setShowJournalForm={setShowJournalForm}
              initialJournal={editJournal}
            />
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showCopiedModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4 transform animate-pulse">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Link Copied!
            </h3>
            <p className="text-gray-600">
              Garden link has been copied to your clipboard
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
