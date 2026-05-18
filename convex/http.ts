import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/expenses/save",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    const tripKey = String(body?.tripKey || "").trim();
    const expenses = Array.isArray(body?.expenses) ? body.expenses : [];
    const updatedAt = String(body?.updatedAt || new Date().toISOString());

    if (!tripKey) {
      return new Response(JSON.stringify({ error: "tripKey is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existing = await ctx.db
      .query("tripExpenses")
      .withIndex("by_tripKey", (q) => q.eq("tripKey", tripKey))
      .first();

    const expensesJson = JSON.stringify(expenses);

    if (existing) {
      await ctx.db.patch(existing._id, { expensesJson, updatedAt });
    } else {
      await ctx.db.insert("tripExpenses", { tripKey, expensesJson, updatedAt });
    }

    return new Response(JSON.stringify({ ok: true, tripKey, count: expenses.length }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }),
});

http.route({
  path: "/expenses/load",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const tripKey = (url.searchParams.get("tripKey") || "").trim();

    if (!tripKey) {
      return new Response(JSON.stringify({ error: "tripKey is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const row = await ctx.db
      .query("tripExpenses")
      .withIndex("by_tripKey", (q) => q.eq("tripKey", tripKey))
      .first();

    const expenses = row?.expensesJson ? JSON.parse(row.expensesJson) : [];

    return new Response(JSON.stringify({ tripKey, expenses, updatedAt: row?.updatedAt || null }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }),
});

http.route({
  path: "/expenses/save",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

http.route({
  path: "/expenses/load",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
    });
  }),
});

export default http;
