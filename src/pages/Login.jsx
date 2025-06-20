import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "firebase/auth";
import { useEffect } from "react";

import FirestoreManager, { firebaseConfig } from "../model/FirestoreManager";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router";

export default function Login() {
  let navigate = useNavigate();

  initializeApp(firebaseConfig);

  async function authStateObserver(user) {
    if (!user) {
      // no user is currently signed in or user signed out
      return;
    }

    // a user is logged in

    // get user data from database
    const currentUser = getAuth().currentUser;
    const currentUserID = currentUser ? currentUser.uid : null;
    const dbManager = FirestoreManager();

    const userRecord = await dbManager.getUser(currentUserID);
    if (!userRecord) {
      // create a record for user
      await dbManager.createCurrentUser();
    }

    // redirect user to his profile
    navigate(`/users/${currentUserID}`);
  }

  useEffect(() => {
    onAuthStateChanged(getAuth(), authStateObserver);
  }, []);

  /**
   * Sign in Firebase with credential from the Google user.
   */
  async function signInHandler() {
    try {
      let provider = new GoogleAuthProvider();
      await signInWithPopup(getAuth(), provider);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Login Page</h1>
        <button
          onClick={signInHandler}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.15 0 5.97 1.17 8.2 3.1l6.1-6.1C34.52 2.39 29.58 0 24 0 14.64 0 6.63 5.94 2.67 14.62l7.84 6.1C12.08 13.41 17.57 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.5 24.5c0-1.6-.14-3.13-.4-4.6H24v9h12.8c-.56 3.13-2.4 5.79-5.1 7.57l7.8 6.1c4.58-4.24 7-10.47 7-17.07z"
            />
            <path
              fill="#FBBC05"
              d="M10.5 28.72a14.5 14.5 0 010-9.44L2.66 13.2a24 24 0 000 21.6l7.84-6.08z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.58 0 12.1-2.17 16.2-5.9l-7.8-6.1c-2.17 1.46-4.96 2.3-8.4 2.3-6.44 0-11.92-3.9-13.5-9.5l-7.83 6.1C6.63 42.06 14.64 48 24 48z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Login with Google
        </button>
      </div>
    </div>
  );
}
