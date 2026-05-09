CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_name TEXT NOT NULL,
  normalized_name TEXT NOT NULL UNIQUE,
  score INTEGER NOT NULL DEFAULT 0,
  game TEXT NOT NULL DEFAULT 'danmaku',
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_scores_game_score ON scores (game, score DESC, updated_at ASC);
