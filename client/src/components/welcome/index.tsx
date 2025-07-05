import React, { useEffect } from "react";
import { usePaste } from "~/hooks/use-paste";
import { useLocation } from "wouter";

import style from "./style.module.css";

export const Welcome = () => {
  const paste = usePaste();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (paste) {
      fetch(`${import.meta.env.VITE_API_URL}/v1/reports`, {
        method: "POST",
        body: paste,
      })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error(`Unhandled status ${resp.status}`);
          }
          return resp.json();
        })
        .then((report) => {
          setLocation(`/${report.id}`);
        })
        .catch((err) => {
          throw err;
        });
    }
  }, [paste, setLocation]);

  return (
    <div className={style.instructions}>
      <h1>Paste the transcript or members from chat…</h1>
      <p>
        Right-click on your chat transcript and select <em>Copy All</em>, or
        left-click on members and press <code>CTRL-A</code> followed by{" "}
        <code>CTRL-C</code>. Then come here and press <code>CTRL-V</code> to get
        a report of all characters affiliations and PvP stats.
      </p>
    </div>
  );
};
