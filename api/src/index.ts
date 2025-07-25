import { type SQLQueryBindings } from "bun:sqlite";
import { db } from "./db";
import { Report, type SerializedReport } from "./report";

function withLogging<T extends Request>(
  handle: (request: T) => Promise<Response>
) {
  return async (request: T) => {
    performance.mark("request");

    const response = await handle(request);

    const { duration } = performance.measure("request", "request");
    console.log(
      `${new Date().toISOString()} ${request.method} ${
        new URL(request.url).pathname
      } ${response.status} ${duration.toFixed(2)}ms`
    );

    return response;
  };
}

function withCors<T extends Request>(
  handle: (request: T) => Promise<Response>
) {
  return async (request: T) => {
    const origin = request.headers.get("Origin");

    if (request.method === "OPTIONS") {
      if (origin) {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      }

      return new Response(null, { status: 204 });
    }

    const response = await handle(request);

    if (origin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }

    return response;
  };
}

function withErrorHandling<T extends Request>(
  handle: (request: T) => Promise<Response>
) {
  return async (request: T) => {
    try {
      return await handle(request);
    } catch (error) {
      console.error(error);
      return Response.json({ error: "Unexpected error" }, { status: 500 });
    }
  };
}

Bun.serve({
  routes: {
    "/v1/reports": {
      POST: withLogging(
        withErrorHandling(
          withCors(async (request) => {
            const body = await request.text();
            if (body.trim().length < 3) {
              return Response.json(
                { error: "Content is too short" },
                { status: 400 }
              );
            }

            const content = Report.parse(body);
            if (content.length < 1) {
              return Response.json(
                { error: "Content couldn't be parsed" },
                { status: 400 }
              );
            }

            const report = new Report();
            report.append(content);

            const data = report.serialize();
            db.exec(
              `INSERT INTO reports (id, createdAt, source) VALUES (?, ?, ?);`,
              [data.id, data.createdAt, data.source]
            );

            return Response.json(report, { status: 201 });
          })
        )
      ),
    },

    "/v1/reports/:id": {
      GET: withLogging(
        withErrorHandling(
          withCors(async (request) => {
            const data = db
              .query<SerializedReport, SQLQueryBindings>(
                `SELECT * FROM reports WHERE id = ? LIMIT 1;`
              )
              .get(request.params.id);

            if (!data) {
              return Response.json(
                { error: "Report not found" },
                { status: 404 }
              );
            }
            const report = Report.unserialize(data);

            return Response.json(report);
          })
        )
      ),

      PATCH: withLogging(
        withErrorHandling(
          withCors(async (request) => {
            const data = db
              .query<SerializedReport, SQLQueryBindings>(
                `SELECT * FROM reports WHERE id = ? LIMIT 1;`
              )
              .get(request.params.id);

            if (!data) {
              return Response.json(
                { error: "Report not found" },
                { status: 404 }
              );
            }
            const report = Report.unserialize(data);

            const body = await request.text();
            if (body.trim().length < 3) {
              return Response.json(
                { error: "Content is too short" },
                { status: 400 }
              );
            }

            const content = Report.parse(body);
            if (content.length < 1) {
              return Response.json(
                { error: "Content couldn't be parsed" },
                { status: 400 }
              );
            }
            report.append(content);

            db.exec(`UPDATE reports SET source = ? WHERE id = ?;`, [
              report.serialize().source,
              report.id,
            ]);

            return Response.json(report);
          })
        )
      ),
    },
  },

  fetch: withLogging(
    withErrorHandling(
      withCors(async () => {
        return Response.json({ error: "Not found" }, { status: 404 });
      })
    )
  ),
});
