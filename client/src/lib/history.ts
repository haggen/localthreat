import { useEffect, useState } from "react";
import type { Report } from "~/lib/report";

type Entry = Report & { visitedAt: string };

type History = Record<string, Entry>;

function getHistory() {
  return JSON.parse(localStorage.getItem("history") ?? "{}") as History;
}

export function useHistory() {
  const [history, setHistory] = useState<History>(getHistory());

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === "history") {
        setHistory(getHistory());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return history;
}

export function useHistoryRecorder(report: Report | null) {
  useEffect(() => {
    if (!report) {
      return;
    }

    const history = getHistory();

    history[report.id] = { ...report, visitedAt: new Date().toISOString() };

    if (Object.keys(history).length > 50) {
      let oldest = {
        id: "",
        createdAt: "",
        content: [],
        visitedAt: new Date().toISOString(),
      } as Entry;

      for (const item of Object.values(history)) {
        if (new Date(item.visitedAt) < new Date(oldest.visitedAt)) {
          oldest = item;
        }
      }

      delete history[oldest.id];
    }

    localStorage.setItem("history", JSON.stringify(history));

    // By default the event only triggers on other windows sharing the same storage context.
    window.dispatchEvent(new StorageEvent("storage", { key: "history" }));
  }, [report]);
}
