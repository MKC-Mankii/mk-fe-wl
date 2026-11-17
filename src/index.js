function json(body, status = 200, headers = {}) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api" || pathname.startsWith("/api/")) {
      if (pathname !== "/api/hello") {
        return json({ error: "API route not found" }, 404);
      }
      if (request.method !== "GET") {
        return json({ error: "Method not allowed" }, 405, { Allow: "GET" });
      }

      try {
        const row = await env.DB.prepare("SELECT id, message FROM demo WHERE id = ?")
          .bind(1)
          .first();

        if (!row) {
          return json({ error: "Record not found" }, 404);
        }
        return json({ id: row.id, message: row.message });
      } catch (error) {
        console.error("D1 query failed:", error);
        return json({ error: "Database query failed" }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
