import { Footer } from "~/components/footer";
import { Help } from "~/components/help";
import { History, Provider as HistoryProvider } from "~/components/history";
import { Report } from "~/components/report";
import { Topbar } from "~/components/topbar";
import { Welcome } from "~/components/welcome";
import React from "react";
import { Route, Switch } from "wouter";
// import { Settings } from "~/components/settings";
import { Provider as DrawerProvider } from "~/components/drawer";

import style from "./style.module.css";

export const App = () => {
  return (
    <DrawerProvider>
      <HistoryProvider>
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
