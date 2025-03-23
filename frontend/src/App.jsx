import { useState } from "react";
import "./App.css";
import Screener from "./components/Screener";
import * as Sentry from "@sentry/react";

function App() {
  return (
    <Sentry.ErrorBoundary fallback={<div>An error has occurred</div>}>
      <div className="app">
        <Screener />
      </div>
    </Sentry.ErrorBoundary>
  );
}

export default App;
