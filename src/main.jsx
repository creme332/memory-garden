import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import MissingUser from "./pages/MissingUser";
import Profile from "./pages/Profile";
import World from "./pages/World";
import HomePage from "./pages/HomePage";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage
  },
  {
    path: "profile",
    Component: Profile
  },
  {
    path: "journals",
    children: [{ path: ":journalId", Component: World }]
  }
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
