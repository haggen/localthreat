import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { db } from "./db.ts";
import { Report, type SerializedReport } from "./report.ts";

function respond(
  response: ServerResponse,
  status: number,
  body: unknown = null,
) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body));
}

function getBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    req.on("error", reject);
  });
}

type Route = {
  pattern: URLPattern;
  handler(params: {
    req: IncomingMessage;
    response: ServerResponse;
    url: URLPatternResult;
  }): Promise<void>;
};

const routes: Route[] = [
  {
    pattern: new URLPattern({ pathname: "/v1/reports" }),
    async handler({ req, response }) {
      const method = req.method ?? "GET";

      switch (method) {
        case "POST": {
          const raw = await getBody(req);

          if (raw.trim().length < 3) {
            respond(response, 400, { error: "Content is too short" });
            break;
          }

          const parsed = Report.parse(raw);

          if (parsed.length < 1) {
            respond(response, 400, { error: "Content couldn't be parsed" });
            break;
          }

          const report = new Report();
          report.append(parsed);

          const data = report.serialize();
          db.prepare(
            `INSERT INTO reports (id, createdAt, source) VALUES (?, ?, ?);`,
          ).run(data.id, data.createdAt, data.source);

          respond(response, 201, report);
          break;
        }

        default: {
          respond(response, 405, { error: "Method not allowed" });
          break;
        }
      }
    },
  },
  {
    pattern: new URLPattern({ pathname: "/v1/reports/:id" }),
    async handler({ req, response, url }) {
      const method = req.method ?? "GET";
      const id = url.pathname.groups.id;

      switch (method) {
        case "GET": {
          const data = db
            .prepare(`SELECT * FROM reports WHERE id = ? LIMIT 1;`)
            .get(id!) as SerializedReport | undefined;

          if (!data) {
            respond(response, 404, { error: "Report not found" });
            break;
          }

          respond(response, 200, Report.unserialize(data));
          break;
        }

        case "PATCH": {
          const data = db
            .prepare(`SELECT * FROM reports WHERE id = ? LIMIT 1;`)
            .get(id!) as SerializedReport | undefined;

          if (!data) {
            respond(response, 404, { error: "Report not found" });
            break;
          }

          const raw = await getBody(req);
          if (raw.trim().length < 3) {
            respond(response, 400, { error: "Content is too short" });
            break;
          }

          const parsed = Report.parse(raw);
          if (parsed.length < 1) {
            respond(response, 400, { error: "Content couldn't be parsed" });
            break;
          }

          const report = Report.unserialize(data);
          report.append(parsed);

          db.prepare(`UPDATE reports SET source = ? WHERE id = ?;`).run(
            report.serialize().source,
            report.id,
          );

          respond(response, 200, report);
          break;
        }

        default: {
          respond(response, 405, { error: "Method not allowed" });
        }
      }
    },
  },
];

async function handler(req: IncomingMessage, response: ServerResponse) {
  const start = performance.now();

  response.on("finish", () => {
    console.log(
      `${new Date().toISOString()} ${req.method} ${req.url} ${
        response.statusCode
      } ${(performance.now() - start).toFixed(2)}ms`,
    );
  });

  try {
    const method = req.method ?? "GET";
    const origin = req.headers.origin;

    if (method === "OPTIONS") {
      response.writeHead(
        204,
        origin
          ? {
              "Access-Control-Allow-Origin": origin,
              "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type",
            }
          : {},
      );
      response.end();
      return;
    }

    if (origin) {
      response.setHeader("Access-Control-Allow-Origin", origin);
    }

    for (const route of routes) {
      const url = route.pattern.exec(req.url, "http://localhost");
      if (url) {
        await route.handler({ req, response, url });
        return;
      }
    }

    respond(response, 404, { error: "Not found" });
  } catch (error) {
    console.error(error);
    respond(response, 500, { error: "Unexpected error" });
  }
}

createServer(handler).listen(3000);
