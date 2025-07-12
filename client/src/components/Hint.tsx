export function Hint() {
  return (
    <article className="flex flex-col gap-3 p-6 items-center text-center">
      <h1 className="text-4xl opacity-50">
        Paste the transcript or members from chat…
      </h1>
      <p className="max-w-xl">
        In the game, right-click on your chat transcript and select Copy All, or
        left-click on members and press CTRL-A followed by CTRL-C. Then come
        here and press CTRL-V to get a report of all characters affiliations and
        PvP stats.
      </p>
    </article>
  );
}
