import React from "react";
import { Link, useLocation } from "wouter";
import { Tooltip } from "components/tooltip";
import copy from "copy-to-clipboard";
import { ReactComponent as Brand } from "./localthreat.svg";
import style from "./style.module.css";

const Share = () => {
  const [location] = useLocation();

  const onClick = () => {
    copy(window.location.href);
  };

  return (
    <Tooltip text={"URL copied!"} trigger="click">
      <button onClick={onClick} disabled={location === "/"}>
        Share
      </button>
    </Tooltip>
  );
};

export const Topbar = () => {
  return (
    <nav className={style.menu}>
      <h1>
        <Link href="/">
          <a aria-label="localthreat">
            <Brand />
          </a>
        </Link>
      </h1>
      <ul>
        <li>
          <Share />
        </li>
        <li>
          <Link href="/">New Report</Link>
        </li>
      </ul>
    </nav>
  );
};
