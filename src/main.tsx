import "./main.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { client } from "./api/requests/client.gen";

client.setConfig({
  baseUrl: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
