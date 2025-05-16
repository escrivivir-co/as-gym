// src/utils/cache.ts
import { promisify } from 'util';

const cache: Record<string, any> = {};
const setCacheAsync = promisify(setCache);
const getCacheAsync = promisify(getCache);

function setCache(key: string, value: any, expiration: number) {
    const expireAt = Date.now() + expiration;
    cache[key] = { value, expireAt };
}

function getCache(key: string) {
    const cachedItem = cache[key];
    if (cachedItem) {
        if (Date.now() < cachedItem.expireAt) {
            return cachedItem.value;
        }
        delete cache[key]; // Remove expired item
    }
    return null;
}

export { setCacheAsync, getCacheAsync };