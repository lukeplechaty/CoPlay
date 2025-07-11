import { Pool } from "pg";

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export function getUser(uuid) {}

export function addUser(uuid, username) {}

export function getVideos() {}

export function getVideo(id) {}
