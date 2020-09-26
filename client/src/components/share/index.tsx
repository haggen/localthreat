import React from "react";
import { useLocation } from "wouter";
import copy from "copy-to-clipboard";
import { Tooltip } from "components/tooltip";

export const Share = () => {
  const [location] = useLocation();

  const onClick = () => {
    copy(window.location.href);
  };

  return (
    <Tooltip text={"Copied!"} trigger="click">
      <button onClick={onClick} disabled={location === "/"}>
        Share
      </button>
    </Tooltip>
  );
};
