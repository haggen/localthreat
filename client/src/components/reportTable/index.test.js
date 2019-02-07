import React from "react";
import ReactDOM from "react-dom";

import ReportTable from ".";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<ReportTable />, div);
  ReactDOM.unmountComponentAtNode(div);
});
