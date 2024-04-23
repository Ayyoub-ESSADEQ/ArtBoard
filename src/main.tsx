import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Whiteboards } from "./routes/whiteboards.tsx";

import { loader as boardLoader } from "./App.tsx";
import { loader as WhiteboardsLoarder } from "./routes/whiteboards.tsx";

const router = createBrowserRouter([
  {
    path: "/whiteboards",
    loader: WhiteboardsLoarder,
    element: <Whiteboards />,
  },
  {
    path: "whiteboards/:whiteboardId",
    loader: boardLoader,
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
