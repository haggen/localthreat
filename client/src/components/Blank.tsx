import { useLocation } from "wouter";
import { request } from "~/lib/api";
import { useAsync } from "~/lib/async";
import { usePaste } from "~/lib/clipboard";
import type { Report } from "~/lib/report";

export function Blank() {
  const [, navigate] = useLocation();
  const { status, error, execute } = useAsync<Report>();

  usePaste(async (text) => {
    execute(() => request<Report>("POST", "/v1/reports", text)).then(
      (report) => {
        navigate(`${report.id}`);
      }
    );
  });

  if (error) {
    return (
      <main className="self-center p-6">
        <article className="flex flex-col gap-3 items-center text-center">
          <h1 className="text-2xl font-bold opacity-50">Error</h1>
          <p className="max-w-1/2">
            An error occurred while processing your input. Please try again.
          </p>
        </article>
      </main>
    );
  }

  if (status === "busy") {
    return (
      <main className="self-center p-6">
        <article className="flex flex-col gap-3 items-center text-center">
          <h1 className="text-2xl font-bold opacity-50">Loading…</h1>
          <p className="max-w-1/2">Parsing your input, please wait.</p>
        </article>
      </main>
    );
  }

  return (
    <main className="self-center p-6">
      <article className="flex flex-col gap-3 items-center text-center">
        <h1 className="text-2xl font-bold opacity-50">
          Paste the transcript or members from chat…
        </h1>
        <p className="max-w-1/2">
          In the game, right-click on your chat transcript and select Copy All,
          or left-click on members and press <code>CTRL-A</code> followed by{" "}
          <code>CTRL-C</code>. Then come here and press <code>CTRL-V</code> to
          get a report of all characters affiliations and PvP stats.
        </p>
      </article>
    </main>
  );
}
