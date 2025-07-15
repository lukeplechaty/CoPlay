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
    const { rows } = await db.query(`SELECT 1 FROM users WHERE uuid = $1`, [
      uuid,
    ]);
    if (rows.length > 0) {
      return false;
    }
    await db.query(`INSERT INTO users (uuid, username) VALUES ($1, $2)`, [
      uuid,
      username,
    ]);
    return true;
  } catch (error) {
    throw new Error(`adding user error: ${error}`);
  }
}

export async function getVideos(limit = 100, offset = 0) {
  try {
    const { rows } = await db.query(
      `
      SELECT videos.id,videos.url,videos.title,videos.views, JSONB_AGG(JSONB_BUILD_OBJECT('type',tag_types.value,'value',tags.value)) AS tags 
      FROM videos 
      JOIN video_tag_links ON videos.id = video_tag_links.video_id 
      JOIN tags ON tags.id = video_tag_links.tag_id 
      JOIN tag_types ON tag_types.id = tags.tag_type_id 
      GROUP BY videos.id 
      LIMIT $1 OFFSET $2`,
      [limit, offset]
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
      SELECT videos.id,videos.url,videos.title,videos.views, JSONB_AGG(JSONB_BUILD_OBJECT('type',tag_types.value,'value',tags.value)) AS tags 
      FROM videos 
      JOIN video_tag_links ON videos.id = video_tag_links.video_id 
      JOIN tags ON tags.id = video_tag_links.tag_id 
      JOIN tag_types ON tag_types.id = tags.tag_type_id 
      WHERE videos.id = $1 
      GROUP BY videos.id`,
      [id]
    );
    return rows[0];
  } catch (error) {
    throw new Error(`geting one video error: ${error}`);
  }
}

export async function searchVideos(searchTerm, limit = 100, offset = 0) {
  try {
    const { rows } = await db.query(
      `
      SELECT videos.id, videos.url, videos.title, videos.views,
        JSONB_AGG(JSONB_BUILD_OBJECT('type', tags.type, 'value', tags.value)) AS tags
      FROM videos
      JOIN video_tag_links ON videos.id = video_tag_links.video_id
      JOIN tags ON tags.id = video_tag_links.tag_id
      WHERE LOWER(videos.title) LIKE LOWER($1)
         OR videos.id IN (
           SELECT video_tag_links.video_id
           FROM video_tag_links
           JOIN tags ON tags.id = video_tag_links.tag_id
           WHERE LOWER(tags.value) LIKE LOWER($1)
         )
      GROUP BY videos.id
      LIMIT $2 OFFSET $3
      `,
      [`%${searchTerm}%`, limit, offset]
    );
    return rows;
  } catch (error) {
    throw new Error(`searching videos error: ${error}`);
  }
}

// Up/down voting functions
export async function setVote(video_id, user_id, direction) {
  try {
    await db.query(
      `INSERT INTO video_users_votes (video_id, user_id, direction)
       VALUES ($1, $2, $3)
       ON CONFLICT (video_id, user_id)
       DO UPDATE SET direction = $3`,
      [video_id, user_id, direction]
    );
    return true;
  } catch (error) {
    throw new Error(`setVote error: ${error}`);
  }
}

export async function removeVote(video_id, user_id) {
  try {
    await db.query(
      `DELETE FROM video_users_votes WHERE video_id = $1 AND user_id = $2`,
      [video_id, user_id]
    );
    return true;
  } catch (error) {
    throw new Error(`removeVote error: ${error}`);
  }
}

export async function getVoteCounts(video_id) {
  try {
    const { rows } = await db.query(
      `SELECT
         COUNT(*) FILTER (WHERE direction = TRUE) AS upvotes,
         COUNT(*) FILTER (WHERE direction = FALSE) AS downvotes
       FROM video_users_votes
       WHERE video_id = $1`,
      [video_id]
    );
    return {
      upvotes: parseInt(rows[0].upvotes, 10),
      downvotes: parseInt(rows[0].downvotes, 10),
    };
  } catch (error) {
    throw new Error(`getVoteCounts error: ${error}`);
  }
}

export async function getUserVote(video_id, user_id) {
  try {
    const { rows } = await db.query(
      `SELECT direction FROM video_users_votes WHERE video_id = $1 AND user_id = $2`,
      [video_id, user_id]
    );
    if (rows.length === 0) return null;
    return rows[0].direction;
  } catch (error) {
    throw new Error(`getUserVote error: ${error}`);
  }
}

export async function addVideo({ url, title, tags = [], user_id }) {
  try {
    const videoRes = await db.query(
      `INSERT INTO videos (url, title, views) VALUES ($1, $2, 0) RETURNING *`,
      [url, title]
    );
    const video = videoRes.rows[0];
    await db.query(
      `INSERT INTO user_video_links (user_id, video_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [user_id, video.id]
    );
    for (const tag of tags) {
      const tagRes = await db.query(
        `INSERT INTO tags (type, value)
         VALUES ($1, $2)
         ON CONFLICT (type, value) DO UPDATE SET type = EXCLUDED.type RETURNING id`,
        [tag.type, tag.value]
      );
      const tagId = tagRes.rows[0].id;
      await db.query(
        `INSERT INTO video_tag_links (video_id, tag_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [video.id, tagId]
      );
    }
    const { rows } = await db.query(
      `SELECT videos.id, videos.url, videos.title, videos.views,
        JSONB_AGG(JSONB_BUILD_OBJECT('type', tags.type, 'value', tags.value)) AS tags
      FROM videos
      JOIN video_tag_links ON videos.id = video_tag_links.video_id
      JOIN tags ON tags.id = video_tag_links.tag_id
      WHERE videos.id = $1
      GROUP BY videos.id`,
      [video.id]
    );
    return rows[0];
  } catch (error) {
    throw new Error(`addVideo error: ${error}`);
  }
}

export async function removeVideo(id) {
  try {
    await db.query(`DELETE FROM user_video_links WHERE video_id = $1`, [id]);
    await db.query(`DELETE FROM video_tag_links WHERE video_id = $1`, [id]);
    await db.query(`DELETE FROM video_users_votes WHERE video_id = $1`, [id]);
    await db.query(`DELETE FROM videos WHERE id = $1`, [id]);
    return true;
  } catch (error) {
    throw new Error(`removeVideo error: ${error}`);
  }
}
