export function Help() {
  return (
    <div className="flex flex-col gap-12 p-6 overflow-y-auto">
      <article className="flex flex-col gap-3">
        <h1 className="text-xl font-bold">What is localthreat?</h1>
        <p>
          It's a website that helps players of EVE Online quickly identify
          friend from foe and assess the level of threat their enemies may
          present.
        </p>
      </article>

      <article className="flex flex-col gap-3">
        <h1 className="text-xl font-bold">How does it work?</h1>
        <p>
          With the window in focus, it listens for paste events from the user.
          You'll need to copy a chat transcript or a channel member list from
          in-game and press <code>CTRL-V</code> on this page. localthreat will
          then parse the pasted content, looking for character names, and query
          more information from official and third-party services, to offer a
          complete report of affiliations and PvP statistics for those players.
        </p>
      </article>

      <article className="flex flex-col gap-3">
        <h1 className="text-xl font-bold">What else can it do?</h1>
        <ul className="list-disc pl-6">
          <li>
            It can understand both chat members list or chat transcript formats.
          </li>
          <li>
            A report will have a unique URL that can be shared with other
            people.
          </li>
          <li>
            The report table can be sorted alphabetically or by any of the
            displayed stats.
          </li>
          <li>
            Pasting into an existing report will add non-duplicate names to it.
          </li>
          <li>
            A history of visited reports will be stored locally in your browser
            and can be accessed using the History panel.
          </li>
          <li>
            <del>Overheat belief!</del>
          </li>
        </ul>
      </article>

      <article className="flex flex-col gap-3">
        <h1 className="text-xl font-bold">How much does it cost?</h1>
        <p>
          Nothing to you. localthreat is completely free to use, displays no
          ads, and has its{" "}
          <a href="https://github.com/haggen/localthreat" className="underline">
            source code released on GitHub
          </a>
          . Although the service has some costs associated with hosting and
          maintenance, I've been happily covering it for the past{" "}
          {new Date().getFullYear() - 2017} years.
        </p>
      </article>

      <article className="flex flex-col gap-3">
        <h1 className="text-xl font-bold">How can I help?</h1>
        <p>
          You could{" "}
          <a
            className="underline"
            href="https://github.com/haggen/localthreat/issues/new/choose"
          >
            leave feedback or report issues
          </a>
          . If you've got the know-how you can always contribute with code, by
          submitting a{" "}
          <a
            className="underline"
            href="https://github.com/haggen/localthreat/pulls"
          >
            pull request on GitHub
          </a>
          . Finally, you could tip me in game. Just send any amount of ISK to{" "}
          <strong>Jason Chorant</strong>.
        </p>
      </article>

      <article className="flex flex-col gap-3">
        <h1 className="text-xl font-bold">I have other questions.</h1>
        <p>
          If you'd like, we can chat about what's on your mind. You may{" "}
          <a
            href="https://github.com/haggen/localthreat/issues/new"
            className="underline"
          >
            open an issue on GitHub
          </a>{" "}
          or send an EVE-mail to <strong>Jason Chorant</strong>, and I'll get
          back to you—eventually.
        </p>
      </article>
    </div>
  );
}
