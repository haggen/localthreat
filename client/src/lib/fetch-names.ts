const { setTimeout } = window;

type Request = {
  id: number;
  resolve: (name: string) => void;
};

type Response = {
  name: string;
  id: number;
}[];
const queue: Request[] = [];

let timeoutRef = 0;

const fetchNames = async (reqs: Request[]) => {
  const resp = await fetch(`https://esi.evetech.net/latest/universe/names/`, {
    method: "post",
    body: JSON.stringify(Array.from(new Set(reqs.map((req) => req.id)))),
  });
  if (!resp.ok) {
    throw Error(resp.statusText);
  }
  const data = (await resp.json()) as Response;
  reqs?.forEach((req) => {
    const thing = data.find(({ id }) => id === req.id);
    if (!thing) {
      console.warn(`fetchNames: couldn't find response for id "${req.id}"`);
      return;
    }
    req.resolve(thing.name);
  });
};

export const schedule = (id: number) => {
  clearTimeout(timeoutRef);

  timeoutRef = setTimeout(() => {
    fetchNames(queue.splice(0, queue.length));
  }, 100);

  return new Promise<string>((resolve) => {
    queue.push({
      id,
      resolve,
    });
  });
};
