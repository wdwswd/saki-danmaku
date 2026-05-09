const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: corsHeaders,
  });
}

function cleanName(value) {
  return String(value || "")
    .replace(/[^\p{L}\p{N}_\- ]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 18);
}

async function getLeaderboard(env) {
  const result = await env.DB.prepare(
    `
      SELECT player_name AS name, score, updated_at
      FROM scores
      WHERE game = 'danmaku'
      ORDER BY score DESC, updated_at ASC
      LIMIT 50
    `,
  ).run();

  return json({ scores: result.results || [] });
}

async function submitScore(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch (error) {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const name = cleanName(payload.name);
  const normalizedName = name.toLowerCase();
  const score = Math.floor(Number(payload.score));

  if (!name) return json({ error: "Player name is required." }, 400);
  if (!Number.isFinite(score) || score < 0 || score > 999999999) {
    return json({ error: "Score is invalid." }, 400);
  }

  const updatedAt = new Date().toISOString();

  await env.DB.prepare(
    `
      INSERT INTO scores (player_name, normalized_name, score, game, updated_at)
      VALUES (?1, ?2, ?3, 'danmaku', ?4)
      ON CONFLICT(normalized_name) DO UPDATE SET
        player_name = excluded.player_name,
        score = excluded.score,
        updated_at = excluded.updated_at
      WHERE excluded.score > scores.score
    `,
  )
    .bind(name, normalizedName, score, updatedAt)
    .run();

  const personalBest = await env.DB.prepare(
    `
      SELECT player_name AS name, score, updated_at
      FROM scores
      WHERE normalized_name = ?1
      LIMIT 1
    `,
  )
    .bind(normalizedName)
    .first();

  return json({ ok: true, best: personalBest });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });

    const url = new URL(request.url);

    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/leaderboard")) {
      return getLeaderboard(env);
    }

    if (request.method === "POST" && url.pathname === "/score") {
      return submitScore(request, env);
    }

    return json({ error: "Not found." }, 404);
  },
};
