import React from "react";
import ReactDOM from "react-dom/client"; // Import createRoot from react-dom/client
import "./styles/globals.css"; // Ensure this file exists or create it
import App from "./App";

const rootElement = document.getElementById("root"); // Select the root element
const root = ReactDOM.createRoot(rootElement); // Create the root using createRoot

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
