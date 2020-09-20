import React from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import { Welcome } from "components/welcome";
import { Report } from "components/report";
import { Tooltip } from "components/tooltip";
import copy from "copy-to-clipboard";
import { ReactComponent as Brand } from "./localthreat.svg";
import style from "./style.module.css";

const ShareButton = () => {
  const [location] = useLocation();

  const onClick = () => {
    copy(window.location.href);
  };

  return (
    <Tooltip text={"URL copied!"} trigger="click">
      <button
        className={style.link}
        onClick={onClick}
        disabled={location === "/"}
      >
        Share
      </button>
    </Tooltip>
  );
};

export const App = () => {
  return (
    <>
      <nav className={style.menu}>
        <h1>
          <Link href="/" aria-label="localthreat">
            <a href="/">
              <Brand aria-label="localthreat" />
            </a>
          </Link>
        </h1>
        <ul>
          <li>
            <ShareButton />
          </li>
          <li>
            <Link className={style.link} href="/">
              New Report
            </Link>
          </li>
        </ul>
      </nav>
      <main className={style.main}>
        <Switch>
          <Route path="/" component={Welcome} />
          <Route path="/:id" component={Report} />
        </Switch>
      </main>
      <footer className={style.footer}>
        <ul>
          <li>© 2017–2020 Arthur Corenzan</li>
          <li>
            Source on{" "}
            <a
              className={style.link}
              href="https://github.com/haggen/localthreat/tree/next"
              target="blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
          <li>
            Data provided by{" "}
            <a
              className={style.link}
              href="https://esi.evetech.net/latest/"
              target="blank"
              rel="noopener noreferrer"
            >
              ESI
            </a>{" "}
            and{" "}
            <a
              className={style.link}
              href="https://zkillboard.com/"
              target="blank"
              rel="noopener noreferrer"
            >
              zKillboard
            </a>
          </li>
          <li>
            Tips go to{" "}
            <a
              className={style.link}
              href="https://zkillboard.com/character/95036967/"
              target="blank"
              rel="noopener noreferrer"
            >
              Jason Chorant
            </a>
          </li>
        </ul>
        <p>
          EVE Online and the EVE logo are the registered trademarks of CCP hf.
          All rights are reserved worldwide. All other trademarks are the
          property of their respective owners. EVE Online, the EVE logo, EVE and
          all associated logos and designs are the intellectual property of CCP
          hf. All artwork, screenshots, characters, vehicles, storylines, world
          facts or other recognizable features of the intellectual property
          relating to these trademarks are likewise the intellectual property of
          CCP hf.
        </p>
      </footer>
    </>
  );
};
