const { setTimeout } = window;

type Request = {
  id: number;
  resolve: (affiliation: Response[0]) => void;
};

type Response = {
  alliance_id?: number;
  character_id: number;
  corporation_id: number;
}[];

const queue: Request[] = [];

let timeoutRef = 0;

const fetchAffiliation = async (reqs: Request[]) => {
  const resp = await fetch(
    `https://esi.evetech.net/latest/characters/affiliation/`,
    {
      method: "post",
      body: JSON.stringify(reqs.map((req) => req.id)),
    }
  );
  if (!resp.ok) {
    throw Error(resp.statusText);
  }
  const data = (await resp.json()) as Response;
  data.forEach((affiliation) => {
    const req = reqs.find(({ id }) => id === affiliation.character_id);
    if (!req) {
      console.warn(
        `fetchAffiliation: couldn't find response for character ID "${affiliation.character_id}"`
      );
      return;
    }
    req.resolve(affiliation);
  });
};

export const schedule = (id: number) => {
  clearTimeout(timeoutRef);

  timeoutRef = setTimeout(() => {
    fetchAffiliation(queue.splice(0, queue.length));
  }, 100);

  return new Promise<Response[0]>((resolve) => {
    queue.push({
      id,
      resolve,
    });
  });
};
