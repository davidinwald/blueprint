import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import * as Sentry from "@sentry/react";
import { browserTracingIntegration } from "@sentry/react";

Sentry.init({
  dsn: "https://5ba4ec0932c92a6bef0e4bd7c8c7dab6@o4505936244506624.ingest.us.sentry.io/4509024884359168",
  integrations: [
    browserTracingIntegration({
      tracePropagationTargets: ["localhost", /^https:\/\/yourdomain\.com/],
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions in development
  // Session Replay
  replaysSessionSampleRate: 0.1, // Sample rate for session replay
  replaysOnErrorSampleRate: 1.0, // Sample rate for error replay
  // Environment
  environment: import.meta.env.MODE,
  // Enable debug mode in development
  debug: import.meta.env.DEV,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
