import { Pool } from "pg";

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function getUser(uuid) {
  try {
    const { rows } = await db.query(`SELECT * FROM users WHERE uuid = $1`, [
      uuid,
    ]);
    return rows[0];
  } catch (error) {
    throw new Error(`geting users error: ${error}`);
  }
}

export async function addUser(uuid, username) {
  try {
    await db.query(`INSERT INTO users (uuid, username) VALUES ($1, $2)`, [
      uuid,
      username,
    ]);
    return true;
  } catch (error) {
    throw new Error(`adding user error: ${error}`);
  }
}

export async function getVideos() {
  try {
    const { rows } = await db.query(
      `
      SELECT videos.id,videos.url,videos.title,videos.views,videos.votes, JSONB_AGG(JSONB_BUILD_OBJECT('type',tags.type,'value',tags.value)) AS tags 
      FROM videos 
      JOIN video_tag_links ON videos.id = video_tag_links.video_id 
      JOIN tags ON tags.id = video_tag_links.tag_id 
      GROUP BY videos.id`
    );
    return rows;
  } catch (error) {
    throw new Error(`geting videos error: ${error}`);
  }
}

export async function getVideo(id) {
  try {
    const { rows } = await db.query(
      `
      SELECT videos.id,videos.url,videos.title,videos.views,videos.votes, JSONB_AGG(JSONB_BUILD_OBJECT('type',tags.type,'value',tags.value)) AS tags 
      FROM videos 
      JOIN video_tag_links ON videos.id = video_tag_links.video_id 
      JOIN tags ON tags.id = video_tag_links.tag_id 
      WHERE videos.id = $1 
      GROUP BY videos.id`,
      [id]
    );
    return rows[0];
  } catch (error) {
    throw new Error(`geting one video error: ${error}`);
  }
}
