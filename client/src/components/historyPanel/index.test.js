import React from "react";
import ReactDOM from "react-dom";

import HistoryPanel from ".";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<HistoryPanel />, div);
  ReactDOM.unmountComponentAtNode(div);
});
