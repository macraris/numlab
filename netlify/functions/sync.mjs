// Anonymous progress sync — Netlify Function backed by Netlify Blobs.
// GET  /api/sync?code=PINA-1234  → returns { data, ts } JSON or 404
// POST /api/sync?code=PINA-1234  + body { data, ts } → saves
//
// Code format: 3-20 chars, [A-Z0-9-]. Lowercase auto-uppercased.
// Storage: a single blob per code in the "progress" store.
//
// CORS-friendly so the SPA can call it (same origin in production anyway).

import { getStore } from "@netlify/blobs";

const STORE_NAME = "progress";
const CODE_RE = /^[A-Z0-9-]{3,20}$/;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  const url = new URL(req.url);
  const code = (url.searchParams.get("code") || "").toUpperCase().trim();
  if (!CODE_RE.test(code)) {
    return new Response(JSON.stringify({ error: "invalid_code" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...CORS },
    });
  }

  const store = getStore({ name: STORE_NAME });

  try {
    if (req.method === "GET") {
      const data = await store.get(code, { type: "json" });
      if (!data) {
        return new Response(JSON.stringify({ error: "not_found" }), {
          status: 404,
          headers: { "Content-Type": "application/json", ...CORS },
        });
      }
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json", ...CORS },
      });
    }

    if (req.method === "POST") {
      let body;
      try { body = await req.json(); }
      catch { return new Response(JSON.stringify({ error: "bad_json" }), { status: 400, headers: { "Content-Type": "application/json", ...CORS } }); }
      // Sanity cap: keep payload small to prevent abuse
      const serialized = JSON.stringify(body);
      if (serialized.length > 50_000) {
        return new Response(JSON.stringify({ error: "too_large" }), {
          status: 413, headers: { "Content-Type": "application/json", ...CORS },
        });
      }
      const ts = Number(body.ts) || Date.now();
      await store.setJSON(code, { data: body.data || {}, ts });
      return new Response(JSON.stringify({ ok: true, ts }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...CORS },
      });
    }

    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405, headers: { "Content-Type": "application/json", ...CORS },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "server_error", detail: String(err) }), {
      status: 500, headers: { "Content-Type": "application/json", ...CORS },
    });
  }
};

export const config = { path: "/api/sync" };
