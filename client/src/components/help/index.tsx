import React from "react";
import { Drawer } from "components/drawer";
import { Article } from "components/article";

export const Help = () => {
  return (
    <Drawer name="help" title="Help" side="left">
      <Article title="What is localthreat?">
        <p>
          It's a web site to help players of EVE Online quickly identify friend
          from foe and asses the level of threat their enemy may present.
        </p>
      </Article>
      <Article title="How does it work?">
        <p>
          With the window in focus it listens to paste events from the user.
          You'll need to copy a chat's transcript or a channel members list from
          in-game and press CTRL+V on this page. Once an input is detected it
          parses the content for character names and queries information from
          the game servers and other third-party APIs to offer a complete a
          report of affiliations and PvP statiscs of those players.
        </p>
      </Article>
      <Article title="What else can it do?">
        <ul>
          <li>
            A report will have an unique URL that can be shared with your
            friends.
          </li>
          <li>
            The table can be sorted alphabetically or by any of the displayed
            stats.
          </li>
          <li>
            Pasting on an existing report will add non duplicate names to it.
          </li>
          <li>
            A history of visited reports will be stored localy on your browser
            and can be accessed using the History panel.
          </li>
          <li>
            <del>Overheat belief!</del>
          </li>
        </ul>
      </Article>
      <Article title="Does it cost anything?">
        <p>
          To you nothing. localthreat is completely free to use, displays no ads
          and also has its source code released under a fairly permissive
          license on GitHub. Go{" "}
          <a
            href="https://github.com/haggen/localthreat"
            target="blank"
            rel="noopener noreferrer"
          >
            check it out
          </a>
          !
        </p>
      </Article>
      <Article title="I have other questions.">
        <p>
          If you'd like we can chat about what's on your mind. You may{" "}
          <a
            href="https://github.com/haggen/localthreat/issues/new"
            target="blank"
            rel="noopener noreferrer"
          >
            open an issue on GitHub
          </a>{" "}
          or send an EVE-mail to <strong>Jason Chorant</strong> and I'll get
          back to you, eventually.
        </p>
      </Article>
    </Drawer>
  );
};
