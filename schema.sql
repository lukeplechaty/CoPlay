CREATE TABLE IF NOT EXISTS users
(
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  uuid TEXT NOT NULL,
  username TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS videos
(
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  views BIGINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tag_types
(
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tags
(
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tag_type_id BIGINT REFERENCES tag_typs(id),
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_video_links (
  user_id BIGINT REFERENCES users(id),
  video_id BIGINT REFERENCES videos(id),
  PRIMARY KEY (user_id, video_id)
);

CREATE TABLE IF NOT EXISTS video_tag_links (
  video_id BIGINT REFERENCES videos(id),
  tag_id BIGINT REFERENCES tags(id),
  PRIMARY KEY (video_id, tag_id)
);

CREATE TABLE IF NOT EXISTS video_users_votes (
  user_id BIGINT REFERENCES users(id),
  video_id BIGINT REFERENCES videos(id),
  direction BOOLEAN NOT NULL,
  PRIMARY KEY (video_id, user_id)
);

insert into storage.buckets (id, name) values ('Videos', 'Videos');
CREATE POLICY "allow uploads" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'Videos');