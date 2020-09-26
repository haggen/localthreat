import React from "react";
import { Route, Switch } from "wouter";
import { Welcome } from "components/welcome";
import { Report } from "components/report";
import { Topbar } from "components/topbar";
import { Footer } from "components/footer";
import { News } from "components/news";
// import { History } from "components/history";
import { Help } from "components/help";
// import { Settings } from "components/settings";
import { DrawerProvider } from "components/drawer";

import style from "./style.module.css";

export const App = () => {
  return (
    <DrawerProvider>
      <News />
      {/* <Settings /> */}
      <Help />
      {/* <History /> */}
      <Topbar />
      <main className={style.main}>
        <Switch>
          <Route path="/" component={Welcome} />
          <Route path="/:id" component={Report} />
        </Switch>
      </main>
      <Footer />
    </DrawerProvider>
  );
};
