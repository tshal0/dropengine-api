import Status404 from "content/pages/Status/Status404/Status404Page";
import { BaseLayout } from "layouts/BaseLayout";
import { LandingPage } from "pages";
import { RegisterPage } from "pages/Register/RegisterPage";
import React from "react";

import { RouteObject } from "react-router-dom";

import baseRoutes from "./BaseRoutes";

const router: RouteObject[] = [
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
    ]
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "*",
    element: <Status404 />,
  },
];

export default router;
