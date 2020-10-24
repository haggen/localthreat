import React from "react";
import ReactDOM from "react-dom";
import { register } from "lib/service-worker-registration";
import { App } from "components/app";

import "resetize";
import "./global.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
register();

