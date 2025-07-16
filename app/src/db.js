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

export async function getVideos(order, limit = 100, offset = 0) {
  let orderby = ``;
  switch (order) {
    case `asc`:
      orderby = `ORDER BY videos.id ASC`;
      break;
    case `desc`:
      orderby = `ORDER BY videos.id DESC`;
      break;
    case `trend`:
      orderby = `ORDER BY videos.views`;
      break;
    default:
      orderby = ``;
      break;
  }
  try {
    const { rows } = await db.query(
      `
      SELECT
        videos.id,
        videos.url,
        videos.title,
        videos.views,
        users.username,
        COALESCE(
          JSONB_AGG(
            DISTINCT JSONB_BUILD_OBJECT('type', tag_types.value, 'value', tags.value)
          ) FILTER (WHERE tags.id IS NOT NULL),
          '[]'
        ) AS tags
      FROM videos
      LEFT JOIN user_video_links ON videos.id = user_video_links.video_id
      LEFT JOIN users ON user_video_links.user_id = users.id
      LEFT JOIN video_tag_links ON videos.id = video_tag_links.video_id
      LEFT JOIN tags ON tags.id = video_tag_links.tag_id
      LEFT JOIN tag_types ON tag_types.id = tags.tag_type_id
      GROUP BY videos.id, users.username
      ${orderby}
      LIMIT $1 OFFSET $2
      `,
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
      SELECT
        videos.id,
        videos.url,
        videos.title,
        videos.views,
        users.username,
        COALESCE(
          JSONB_AGG(
            DISTINCT JSONB_BUILD_OBJECT('type', tag_types.value, 'value', tags.value)
          ) FILTER (WHERE tags.id IS NOT NULL), 
          '[]'
        ) AS tags 
      FROM videos 
      LEFT JOIN user_video_links ON videos.id = user_video_links.video_id
      LEFT JOIN users ON user_video_links.user_id = users.id
      LEFT JOIN video_tag_links ON videos.id = video_tag_links.video_id 
      LEFT JOIN tags ON tags.id = video_tag_links.tag_id 
      LEFT JOIN tag_types ON tag_types.id = tags.tag_type_id 
      WHERE videos.id = $1 
      GROUP BY videos.id, users.username
      `,
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
      SELECT 
        videos.id, 
        videos.url, 
        videos.title, 
        videos.views,
        users.username,
        COALESCE(
          JSONB_AGG(
            DISTINCT JSONB_BUILD_OBJECT('type', tag_types.value, 'value', tags.value)
          ) FILTER (WHERE tags.id IS NOT NULL), 
          '[]'
        ) AS tags
      FROM videos
      LEFT JOIN user_video_links ON videos.id = user_video_links.video_id
      LEFT JOIN users ON user_video_links.user_id = users.id
      LEFT JOIN video_tag_links ON videos.id = video_tag_links.video_id
      LEFT JOIN tags ON tags.id = video_tag_links.tag_id
      LEFT JOIN tag_types ON tag_types.id = tags.tag_type_id
      WHERE LOWER(videos.title) LIKE LOWER($1)
         OR videos.id IN (
           SELECT video_tag_links.video_id
           FROM video_tag_links
           JOIN tags ON tags.id = video_tag_links.tag_id
           WHERE LOWER(tags.value) LIKE LOWER($1)
         )
      GROUP BY videos.id, users.username
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
      `INSERT INTO videos (url, title) VALUES ($1, $2) RETURNING *`,
      [url, title]
    );
    const video = videoRes.rows[0];
    await db.query(
      `INSERT INTO user_video_links (user_id, video_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [user_id, video.id]
    );
    for (const tag of tags) {
      const tagRes = await db.query(
        `INSERT INTO tags (tag_type_id, value)
         VALUES ($1, $2)
         ON CONFLICT (tag_type_id, value) DO UPDATE SET type = EXCLUDED.type RETURNING id`,
        [tag.id, tag.value]
      );
      const tagId = tagRes.rows[0].id;
      await db.query(
        `INSERT INTO video_tag_links (video_id, tag_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [video.id, tagId]
      );
    }
    return true;
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

export async function getTagTypes() {
  try {
    const { rows } = await db.query(`SELECT * FROM tag_types`);
    return rows;
  } catch (error) {
    throw new Error(`geting Tag Types error: ${error}`);
  }
}

export async function updateVideoViews(id) {
  try {
    const { rows } = await db.query(
      `SELECT views FROM videos WHERE videos.id = $1`,
      [id]
    );
    console.log(rows[0].views);

    await db.query(`UPDATE videos SET views = $1 WHERE videos.id = $2`, [
      parseInt(rows[0].views, 10) + 1,
      id,
    ]);

    return true;
  } catch (error) {
    throw new Error(`geting one video error: ${error}`);
  }
}

export async function getUserVideos(user_id, limit = 100, offset = 0) {
  try {
    const { rows } = await db.query(
      `
      SELECT 
        videos.id, 
        videos.url, 
        videos.title, 
        videos.views,
        users.username,
        COALESCE(
          JSONB_AGG(
            DISTINCT JSONB_BUILD_OBJECT('type', tag_types.value, 'value', tags.value)
          ) FILTER (WHERE tags.id IS NOT NULL), 
          '[]'
        ) AS tags
      FROM videos
      LEFT JOIN user_video_links ON videos.id = user_video_links.video_id
      LEFT JOIN users ON user_video_links.user_id = users.id
      LEFT JOIN video_tag_links ON videos.id = video_tag_links.video_id
      LEFT JOIN tags ON tags.id = video_tag_links.tag_id
      LEFT JOIN tag_types ON tag_types.id = tags.tag_type_id
      WHERE user_video_links.user_id = $1
      GROUP BY videos.id, users.username
      LIMIT $2 OFFSET $3
      `,
      [user_id, limit, offset]
    );
    return rows;
  } catch (error) {
    throw new Error(`getUserVideos error: ${error}`);
  }
}

export async function editVideo({ video_id, url, title, tags = [] }) {
  try {
    // Update video details
    await db.query(`UPDATE videos SET url = $1, title = $2 WHERE id = $3`, [
      url,
      title,
      video_id,
    ]);

    // Remove old tag links
    await db.query(`DELETE FROM video_tag_links WHERE video_id = $1`, [
      video_id,
    ]);

    // Add new tags and links
    for (const tag of tags) {
      const tag_res = await db.query(
        `INSERT INTO tags (tag_type_id, value)
         VALUES ($1, $2)
         ON CONFLICT (tag_type_id, value) DO UPDATE SET value = EXCLUDED.value RETURNING id`,
        [tag.id, tag.value]
      );
      const tag_id = tag_res.rows[0].id;
      await db.query(
        `INSERT INTO video_tag_links (video_id, tag_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [video_id, tag_id]
      );
    }

    return true;
  } catch (error) {
    throw new Error(`edit_video error: ${error}`);
  }
}
