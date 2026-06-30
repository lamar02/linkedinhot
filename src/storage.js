import { put, get } from '@vercel/blob';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const USE_BLOB = !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

export async function readData(filename) {
  if (!USE_BLOB) {
    try {
      const content = await readFile(join('data', filename), 'utf-8');
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  try {
    const blob = await get(`linkedin-hot/${filename}`, { access: 'private' });
    if (!blob) return null;
    const text = await new Response(blob.stream).text();
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function writeData(filename, data) {
  if (!USE_BLOB) {
    await mkdir('data', { recursive: true });
    await writeFile(join('data', filename), JSON.stringify(data, null, 2));
    return;
  }

  await put(`linkedin-hot/${filename}`, JSON.stringify(data, null, 2), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}

export const DEFAULTS = {
  'schedule.json': {
    themeIndex: 0,
    lastPostDate: null,
    postCount: 0,
  },
  'posts.json': {
    posts: [],
  },
  'ghostwriter_history.json': {
    entries: [],
  },
};

export async function readOrInit(filename) {
  const data = await readData(filename);
  if (data !== null) return data;
  const defaults = DEFAULTS[filename];
  if (defaults) await writeData(filename, defaults);
  return defaults ?? null;
}
