import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // <-- Must point to THIS file
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
