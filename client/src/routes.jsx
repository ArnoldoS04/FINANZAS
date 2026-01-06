// routes.js
import React from "react";
import { Dashboard } from "./views/pages/Dashboard";

import PrivateRoute from "./components/PrivateRoutes";
import Login from "./views/pages/login/Login";
import Page404 from "./views/pages/page404/Page404";
import Ingresos from "./views/pages/Ingresos";
import Egreso from "./views/pages/Egreso";
import ReportEgreso from "./views/pages/ReportEgreso";
import ReportIngreso from "./views/pages/ReportIngreso";

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
    path: "/rexpenses",
    name: "REgresos",
    element: (
      <PrivateRoute>
        <ReportEgreso />
      </PrivateRoute>
    ),
  },
  {
    path: "/rincomes",
    name: "RIngresos",
    element: (
      <PrivateRoute>
        <ReportIngreso />
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
