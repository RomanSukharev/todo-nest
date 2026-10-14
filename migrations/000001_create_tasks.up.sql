CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'pending',
              CHECK (status in ('pending', 'in_progress', 'completed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now (),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now ()
);

CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks (status);