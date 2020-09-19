import React from "react";
import { Link, Route, Switch } from "wouter";
import { Welcome } from "components/welcome";
import { Report } from "components/report";
import { ReactComponent as Brand } from "./localthreat.svg";
import style from "./style.module.css";

export const App = () => {
  return (
    <>
      <nav className={style.menu}>
        <h1>
          <Brand />
        </h1>
        <ul>
          <li>
            <button className={style.link}>Share</button>
          </li>
          <li>
            <Link className={style.link} href="/">
              New Report
            </Link>
          </li>
          <li>
            <button className={style.link}>History</button>
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
              href="https://github.com/haggen/localthreat"
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
