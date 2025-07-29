import { createClient } from "redis";

export const RedisPub = createClient();
export const RedisSub = createClient();

await RedisPub.connect()
await RedisSub.connect()

RedisSub.on('error', (err) => console.error('Redis Sub Error:', err));
RedisPub.on('error', (err) => console.error('Redis Pub Error:', err));