import React from "react";
import { Link } from "wouter";
import { useDrawer } from "components/drawer";
import { Share } from "components/share";

import style from "./style.module.css";
import { ReactComponent as Brand } from "./localthreat.svg";

export const Topbar = () => {
  const { open: openNewsPanel } = useDrawer("news");
  // const { open: openSettingsPanel } = useDrawer("settings");
  const { open: openHelpPanel } = useDrawer("help");
  const { open: openHistoryPanel } = useDrawer("history");

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
          <button onClick={() => openNewsPanel()}>News</button>
        </li>
        {/* <li>
          <button onClick={() => openSettingsPanel()}>Settings</button>
        </li> */}
        <li>
          <button onClick={() => openHelpPanel()}>Help</button>
        </li>
        <li>
          <a
            href="https://github.com/haggen/localthreat/issues/new/choose"
            target="blank"
            rel="noopener noreferrer"
          >
            Feedback
          </a>
        </li>
        <li style={{ flexGrow: 1 }} />
        <li>
          <Share />
        </li>
        <li>
          <Link href="/">New Report</Link>
        </li>
        <li>
          <button onClick={() => openHistoryPanel()}>History</button>
        </li>
      </ul>
    </nav>
  );
};
