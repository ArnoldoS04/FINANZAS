// routes.js
import React from "react";
import { Dashboard } from "./views/pages/Dashboard";

import PrivateRoute from "./components/PrivateRoutes";
import Login from "./views/pages/login/Login";
import Page404 from "./views/pages/page404/Page404";
import Ingresos from "./views/pages/Ingresos";
import Egreso from "./views/pages/Egreso";

const routes = [
  {
    path: "/login",
    name: "Login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/incomes",
    name: "Ingresos",
    element: (
      <PrivateRoute>
        <Ingresos />
      </PrivateRoute>
    ),
  },
  {
    path: "/expenses",
    name: "Egresos",
    element: (
      <PrivateRoute>
        <Egreso />
      </PrivateRoute>
    ),
  },
  {
    path: "*",
    name: "404",
    element: <Page404 />,
  },
];

export default routes;
