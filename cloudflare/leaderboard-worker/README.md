# Saki Danmaku Cloudflare Leaderboard

This Worker stores each player's highest shooting-game score in Cloudflare D1.

## Files

- `src/index.js`: Worker API.
- `schema.sql`: D1 table and index.
- `wrangler.toml.example`: copy to `wrangler.toml` and fill your D1 database ID.

## Deploy

```bash
cd cloudflare/leaderboard-worker
npm create cloudflare@latest -- --help
npx wrangler login
npx wrangler d1 create saki_danmaku_scores
cp wrangler.toml.example wrangler.toml
```

Paste the database ID from `wrangler d1 create` into `wrangler.toml`.

```bash
npx wrangler d1 execute saki_danmaku_scores --remote --file=schema.sql
npx wrangler deploy
```

After deployment, Wrangler prints a Worker URL like:

```text
https://saki-danmaku-leaderboard.<your-subdomain>.workers.dev
```

Paste that into the game's `config.js`:

```js
window.SAKI_CONFIG = {
  leaderboardApiBaseUrl: "https://saki-danmaku-leaderboard.<your-subdomain>.workers.dev",
};
```

Then upload/deploy the game files again.
