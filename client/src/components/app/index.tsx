import React from "react";
import { Route, Switch } from "wouter";
import { Welcome } from "components/welcome";
import { Report } from "components/report";
import { Topbar } from "components/topbar";
import { Footer } from "components/footer";
import { News } from "components/news";
import { History, Provider as HistoryProvider } from "components/history";
import { Help } from "components/help";
// import { Settings } from "components/settings";
import { Provider as DrawerProvider } from "components/drawer";

import style from "./style.module.css";

export const App = () => {
  return (
    <DrawerProvider>
      <HistoryProvider>
        <News />
        {/* <Settings /> */}
        <Help />
        <History />
        <Topbar />
        <main className={style.main}>
          <Switch>
            <Route path="/" component={Welcome} />
            <Route path="/:id" component={Report} />
          </Switch>
        </main>
        <Footer />
      </HistoryProvider>
    </DrawerProvider>
  );
};
