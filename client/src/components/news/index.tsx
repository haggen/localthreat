import React from "react";
import { Drawer } from "components/drawer";
import { Article } from "components/article";

export const News = () => {
  return (
    <Drawer name="news" title="News" side="left">
      <Article title="Known issues" date={new Date(2020, 8, 25)}>
        <p>
          As it usually is we still have a few kinks to iron out that you may or
          may not encounter while using the site.
        </p>
        <ul>
          <li>
            Affiliations not loading. There’s an issue with ad blockers that's
            preventing the request for affliations from responding. Turning the
            ad blocker off on this site will fix the issue. Don’t worry though,
            localthreat is ad free.
          </li>
          <li>
            Stats taking too long. The PvP statistics API has some aggressive
            throttling, meaning it can only respond once per second. There may
            be some mitigation for this issue in the future.
          </li>
        </ul>
      </Article>
      <Article title="Launching version 2.0" date={new Date(2020, 8, 25)}>
        <p>
          The whole thing has been rebuilt from the ground up now with the
          latest technology, plus a few goodies:
        </p>
        <ul>
          <li>Fresh new look and feel</li>
          <li>Summary of corporations and alliances</li>
          <li>New History feature</li>
          <li>Extendable reports</li>
          <li>Sturdier data fetching</li>
        </ul>
        <p>
          It’s just the beginning though, more features are on the way like
          different color schemes based on the races of EVE, keyboard shortcuts,
          and more!
        </p>
        <p>Stay tuned!</p>
      </Article>
    </Drawer>
  );
};
