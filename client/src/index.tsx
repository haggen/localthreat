import React from "react";
import ReactDOM from "react-dom";
import { App } from "components/app";

import "resetize";
import "./global.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
