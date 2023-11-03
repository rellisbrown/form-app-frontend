import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import LandingPage from "./pages/LandingPage";
import Admin from "admin_app/Admin";
import User from "user_app/User";
/* import React, { Suspense } from "react"; */

/* const Admin = React.lazy(() => import("admin_app/Admin")); */

/* import "./App.css"; */

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/admin/*",
    element: <Admin />,
  },
  {
    path: "/forms/*",
    element: <User />,
  },
]);

function App() {
  return (
    <>
      <CssBaseline />
      {/* <Suspense fallback={<div>Loading</div>}> */}
      <RouterProvider router={router} />
      {/*  </Suspense> */}
    </>
  );
}

export default App;
