const { setTimeout } = window;

type Request = {
  name: string;
  resolve: (id: number) => void;
};

type Response = {
  characters?: {
    id: number;
    name: string;
  }[];
};

const queue: Request[] = [];

let timeoutRef = 0;

const fetchIds = async (reqs: Request[]) => {
  console.debug(reqs);
  const resp = await fetch(`https://esi.evetech.net/latest/universe/ids/`, {
    method: "post",
    body: JSON.stringify(Array.from(new Set(reqs.map((req) => req.name)))),
  });
  if (!resp.ok) {
    throw Error(resp.statusText);
  }
  const data = (await resp.json()) as Response;
  data.characters?.forEach((char) => {
    const req = reqs.find(({ name }) => name === char.name);
    if (!req) {
      console.warn(`fetchIds: couldn't find response for name "${char.name}"`);
      return;
    }
    req.resolve(char.id);
  });
};

export const schedule = (name: string) => {
  clearTimeout(timeoutRef);

  timeoutRef = setTimeout(() => {
    fetchIds(queue.splice(0, queue.length));
  }, 10);

  return new Promise<number>((resolve) => {
    queue.push({
      name,
      resolve,
    });
  });
};
