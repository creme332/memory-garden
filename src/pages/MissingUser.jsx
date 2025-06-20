import { Link } from "react-router";

function MissingUser() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border border-red-300 text-red-700 p-6 rounded-xl shadow-md max-w-md text-center">
        <h2 className="text-xl font-semibold mb-2">Missing User ID</h2>
        <p className="text-sm text-gray-600 mb-4">
          Please access a valid user profile or return to the homepage.
        </p>
        <Link to={"/"}>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition">
            Go to Home
          </button>
        </Link>
      </div>
    </div>
  );
}

export default MissingUser;
