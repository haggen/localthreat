CREATE TABLE IF NOT EXISTS reports (
	id text NOT NULL PRIMARY KEY,
	data text[]
);

ALTER TABLE reports ADD IF NOT EXISTS time timestamptz NOT NULL DEFAULT now();

