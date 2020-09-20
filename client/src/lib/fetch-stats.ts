const { setInterval } = window;

type Request = {
  id: number;
  resolve: (stats: Stats) => void;
};

type Stats = {
  dangerRatio: number;
  gangRatio: number;
  shipsLost: number;
  shipsDestroyed: number;
  ships: {
    id: number;
    name: string;
  }[];
};

const queue: Request[] = [];

setInterval(async () => {
  const req = queue.shift();
  if (!req) {
    return;
  }
  let resp;
  try {
    resp = await fetch(
      `https://zkillboard.com/api/stats/characterID/${req.id}/`,
      {
        headers: {
          origin: window.location.hostname,
        },
      }
    );
  } catch (err) {
    console.warn("Fetch failed, back to the end of the queue", err);
    queue.push(req);
    return;
  }
  if (!resp.ok) {
    throw Error(`Bad status ${resp.status}`);
  }
  const {
    dangerRatio,
    gangRatio,
    shipsDestroyed,
    shipsLost,
    topLists,
  } = await resp.json();
  const ships = topLists
    .find(({ type }: { type: string }) => type === "shipType")
    ?.values.map(({ id, name }: { id: number; name: string }) => ({
      id,
      name,
    }));
  req.resolve({ dangerRatio, gangRatio, shipsDestroyed, shipsLost, ships });
}, 1000);

export const schedule = (id: number) => {
  return new Promise<Stats>((resolve) => {
    queue.push({
      id,
      resolve,
    });
  });
};
