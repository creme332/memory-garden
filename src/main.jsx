import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import World from "./pages/World";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    Component: World
  }
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
