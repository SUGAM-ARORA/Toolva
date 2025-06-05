// Cache implementation using IndexedDB
import { openDB } from 'idb';

const DB_NAME = 'toolva-cache';
const STORE_NAME = 'api-cache';
const VERSION = 1;

const initDB = async () => {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });
};

export const cacheData = async (key: string, data: any, ttl = 3600000) => {
  const db = await initDB();
  await db.put(STORE_NAME, {
    data,
    timestamp: Date.now(),
    ttl,
  }, key);
};

export const getCachedData = async (key: string) => {
  const db = await initDB();
  const cached = await db.get(STORE_NAME, key);
  
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > cached.ttl) {
    await db.delete(STORE_NAME, key);
    return null;
  }
  
  return cached.data;
};