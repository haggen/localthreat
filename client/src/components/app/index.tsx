import React from "react";
import { Route, Switch } from "wouter";
import { Welcome } from "components/welcome";
import { Report } from "components/report";
import { Topbar } from "components/topbar";
import { Footer } from "components/footer";
import style from "./style.module.css";

export const App = () => {
  return (
    <>
      <Topbar />
      <main className={style.main}>
        <Switch>
          <Route path="/" component={Welcome} />
          <Route path="/:id" component={Report} />
        </Switch>
      </main>
      <Footer />
    </>
  );
};
