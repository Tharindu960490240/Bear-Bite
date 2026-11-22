/* Serves uploaded photos stored in KV. */
const TYPES = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };
export async function onRequestGet({ params, env }) {
  const name = String(params.name || "");
  const ext = name.split(".").pop();
  if (!env.BB || !/^[\w-]+\.(jpg|png|webp)$/.test(name)) return new Response("Not found", { status: 404 });
  const data = await env.BB.get("img:" + name, "arrayBuffer");
  if (!data) return new Response("Not found", { status: 404 });
  return new Response(data, { headers: { "Content-Type": TYPES[ext], "Cache-Control": "public, max-age=2592000, immutable", "X-Content-Type-Options": "nosniff" } });
}
