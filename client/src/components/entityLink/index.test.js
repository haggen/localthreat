import React from "react";
import ReactDOM from "react-dom";

import EntityLink from ".";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<EntityLink />, div);
  ReactDOM.unmountComponentAtNode(div);
});
