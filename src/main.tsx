import React from "react";
// @ts-ignore: some environments may not have @types/react-dom/client installed
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import App from "./App";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
