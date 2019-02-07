import React from "react";
import ReactDOM from "react-dom";

import Flex from ".";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Flex />, div);
  ReactDOM.unmountComponentAtNode(div);
});
