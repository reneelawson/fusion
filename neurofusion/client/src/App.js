import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import React, { useState, useEffect } from 'react';


import Root from "./routes/root";
import Analysis from './routes/analysis';
import ErrorPage from './routes/error-page';
import Recordings from './routes/recordings';
import Settings from './routes/settings';
import LandingPage from './routes/landingpage';
import AuthManager from "./routes/authmanager";
import NeurosityCallback from "./routes/neurositycallback";

import { ProvideNotion } from "./services/neurosity";
import { ProvideNeurofusionUser } from "./services/auth";

import './App.css';


const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <AuthManager />,
    errorElement: <ErrorPage />
  },
  {
    path: "/lab",
    element: <Root />,
    errorElement: <ErrorPage />
  },
  {
    path: "/analysis",
    element: <Analysis />,
    errorElement: <ErrorPage />
  },
  {
    path: "/recordings",
    element: <Recordings />,
    errorElement: <ErrorPage />
  },
  {
    path: "/settings",
    element: <Settings />,
    errorElement: <ErrorPage />
  },
  {
    path: "/neurosity-callback",
    element: <NeurosityCallback />,
    errorElement: <ErrorPage />
  }
]);

function App() {
  return (
    <ProvideNeurofusionUser>
      <ProvideNotion>
        <RouterProvider router={router} />
        {/* TODO: handle authentication on routes */}
      </ProvideNotion>
    </ProvideNeurofusionUser>
  );
}

export default App;