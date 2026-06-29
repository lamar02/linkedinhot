import { put, list } from '@vercel/blob';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function readData(filename) {
  if (!USE_BLOB) {
    try {
      const content = await readFile(join('data', filename), 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  const { blobs } = await list({ prefix: `linkedin-hot/${filename}` });
  if (blobs.length === 0) return null;
  const res = await fetch(blobs[0].url, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export async function writeData(filename, data) {
  if (!USE_BLOB) {
    await mkdir('data', { recursive: true });
    await writeFile(join('data', filename), JSON.stringify(data, null, 2));
    return;
  }

  await put(`linkedin-hot/${filename}`, JSON.stringify(data, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

export const DEFAULTS = {
  'schedule.json': {
    themeIndex: 0,
    weekNumber: 1,
    lastPostDate: null,
    postCount: 0,
  },
  'posts.json': {
    posts: [],
  },
};

export async function readOrInit(filename) {
  const data = await readData(filename);
  if (data !== null) return data;
  const defaults = DEFAULTS[filename];
  if (defaults) await writeData(filename, defaults);
  return defaults ?? null;
}
